import {
  Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ElementRef, ViewChild,
  OnChanges, Directive, Renderer, ViewChildren, OnDestroy
} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {TaskService} from "../services/task.service";
import {UserService} from "../services/user.service";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import * as firebase from 'firebase';
import {Router} from "@angular/router";


import 'rxjs/add/operator/take'
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})


export class TasksComponent implements OnInit, OnChanges, OnDestroy {

  homePage = '/'
  subLogo = "Пульс"
  public tasks = [];
  public selectedTask = {};
  public userId: string;
  public detailVisible: boolean;
  public taskDetailShow: boolean = false;
  newTaskId;
  public user: any;
  public emptyTasksHidden: boolean = true;

  public newTasks = []

  timerId;
  public percent = 20;


  constructor(public router: Router, public el: ElementRef, public renderer: Renderer, private http: Http, private af: AngularFire, public taskService: TaskService, public userService: UserService) {
  }



  handleCancel(taskId) {
    this.taskService.cancelTask(taskId)
  }

  acceptTask(task, index) {
    this.taskService.acceptTask(task.taskId, this.userId)
    this.af.database.object("tasks/" + task.taskId, { preserveSnapshot: true }).take(1).subscribe(snapshot => {
      var clientId = snapshot.val().fromId
      this.taskService.sendPush("Дизайнер принял задачу", clientId, task.taskId)
      this.newTasks.splice(index,1)
    })

  }


  onSelect(task) {
      this.detailVisible = true;
      this.selectedTask = task
  }


  openArchive() {

  }

  ngOnChanges() {
  }

  ngOnInit(): any {

    var authRef = this.af.auth.take(1).subscribe(user => {
      if(user) {
        this.userId = user.uid
        console.log(this.userId)
        let userRef = this.af.database.object("designers/" + this.userId, {preserveSnapshot: true}).take(1)
        userRef.subscribe(snapshot => {
          this.user = snapshot.val()

        });

        let inbox = this.af.database.list('designers/' + this.userId + "/inbox", { preserveSnapshot: true}).subscribe(snapshot => {
          snapshot.forEach( snapshot => {
            console.log(snapshot.val())
            if(snapshot.val() !== null) {
              // this.newTaskId = snapshot.key

              var taskRef = this.af.database.object('tasks/' + snapshot.key, { preserveSnapshot: true})
              taskRef.subscribe(snapshot=>{


                var task = snapshot.val()

                if (snapshot.val().attach) {
                  var attach = task.attach
                  var dataArray = new Array;
                  for(var o in attach) {
                    dataArray.push(attach[o]);
                  }
                  task.attach = dataArray
                }

                var found = this.newTasks.some(el => {
                  return el.taskId === task.taskId;
                });

                if(!found) {
                  this.newTasks.push(task)
                }

                  if(snapshot.val().status !== "none") {
                    this.af.database.object('designers/' + this.userId + "/inbox/" + snapshot.val().taskId).remove()
                    this.newTasks = this.newTasks.filter(function( obj ) {
                      return obj.taskId !== snapshot.val().taskId;
                    });
                  }
              })

            } else {

            }

          })
        })


        var ref = this.af.database.list("tasks/", {
          preserveSnapshot: true,
          query: {
            orderByChild: 'toId',
            equalTo: this.userId
          }
        }).subscribe(snapshot => {
          snapshot.forEach(snapshot => {

                    var status = snapshot.val().status
                    if (status !== 'archive' && status !== 'reject') {
                      var found = this.tasks.some(el => {
                        return el.taskId === snapshot.val().taskId;
                      });

                      if(!found) {
                        this.tasks.push(snapshot.val())
                      }
                    }

          })

          if(this.tasks.length > 0) {
            this.selectedTask = this.tasks[0]
            this.detailVisible = true
          }



          firebase.database().ref("designers/" + this.userId + "/activeTasks").on("child_removed", function (snap) {
            console.log(this.tasks, snap.key)
            // this.tasks.filter(function(el) {
            //   console.log(el.taskId, snap.key)
            //   return el.taskId === snap.key;
            // });
          })



        })
      } else {
        this.router.navigate(['/login'])
      }
    })


  }


  showTaskDetail() {
    if(this.taskDetailShow === false)
      this.taskDetailShow = true
    else
      this.taskDetailShow = false
  }

  changeDesc( value, desc ) {
    for (var i in this.tasks) {
      if (this.tasks[i].taskId == value) {
        this.tasks[i].unread = desc;
        break; //Stop this loop, we found it!
      }
    }

  }

  ngOnDestroy() {

  }

  skipTask(task, i) {
    this.af.database.object("designers/" + this.userId + "/inbox/" + task.taskId).remove()
    this.newTasks.splice(i, 1)
  }

}
