import {Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {TaskService} from "../../services/task.service";
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { FileUploader } from 'ng2-file-upload';



@Component({
  selector: 'tasks-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent  implements OnChanges{
  public uploader:FileUploader = new FileUploader({url:'http://localhost:3001/upload'});
  public client: FirebaseObjectObservable<any>;

  @Input() task: any;
  @Input() user: any;
  public chat = [];
  childChanged = new EventEmitter<string>();
  chathidden: boolean = true;
  ureadMessages: boolean;

  public files = [];
  public mokups: FirebaseListObservable<any[]>;

  tempClient: boolean;

  constructor( public taskService: TaskService, public af: AngularFire ) {



  }


    ngOnChanges() {
        let ref = this.af.database.object("tasks/" + this.task.taskId, { preserveSnapshot: true})
        ref.subscribe(snapshot => {
            this.task.status = snapshot.val().status


        })
        this.client = this.af.database.object("clients/" + this.task.fromId)

        let taskMessages = this.af.database.list('task-messages/' + this.task.taskId, { preserveSnapshot: true } );
        taskMessages.subscribe(snapshot => {
            this.chat = []
            snapshot.forEach(snapshot => {
                let messages = this.af.database.object('messages/' + snapshot.key, { preserveSnapshot: true });
                messages.subscribe(snapshot => {

                    var found = this.chat.some(el => {
                        return el.timestamp === snapshot.val().timestamp;
                    });

                    if(!found) {
                        this.chat.push(snapshot.val())
                    }

                })
            })
        })

        if(this.task.unread)
            this.ureadMessages = true
        else
            this.ureadMessages = false

    }

    openChat(task) {

        this.chathidden = false
        if(task.unread) {
            delete task.unread
            this.ureadMessages = false
        }

    }

  ngOnInit() {
      var clientId = this.task.fromId
      var cut = clientId.substring(0, 3);

      if (cut === 'tmp')
          this.tempClient = true
      else
          this.tempClient = false
  }


  cancelTask() {
      this.taskService.rejectTask(this.task.taskId)
      //отправим пуш клиенту что задача отменена
      this.taskService.sendPush("Задача отменена", this.task.fromId, this.task.taskId)
  }

}
