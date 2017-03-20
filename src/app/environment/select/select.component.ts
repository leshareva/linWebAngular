import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {User} from "../../Models/new-user.interface";
import 'rxjs/add/operator/take'
import * as firebase from "firebase"
import {EnvironmentService} from "../../services/environment.service";
import {Router} from "@angular/router";

@Component({
  selector: 'environment-select',
  // template: ``,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})

export class SelectComponent implements OnInit, OnChanges {
  lectures = [];
  user: User;
  public homeWorkShow: boolean = false;
  public title: string;
  public body: FirebaseObjectObservable<any>;
  public selectedLecture = {
    body: "",
    title: "",
    week: 0,
    homeWork: "",
    hwStatus: ""
  };
  public activeTip = {
    title: '',
    body: ''
  };




  tips = [
    {
      title: "Что такое Лакмус",
      body: "Лакмус — это отборочный этап в Лине. 8 статей и заданий помогут нам с вами познакомиться. Новая статья открывается после сдачи домашки. После последнего задания мы примим решение о допуске в систему."
    },
    {
      title: "Мы рассматриваем заявку",
      body: "Ответ мы отправим на почту в течение недели."
    },
    {
      title: "Заявка одобрена",
      body: "Изучите инструкции."
    }
  ]

  instructions = []

  public homeWorkStatus: boolean = false;

  @Output() userUpdated = new EventEmitter();
  files = []
  public section = "Лаккккккк"
  hiddenTip: boolean = false;

  // public user: User;
  constructor(public af: AngularFire, public env: EnvironmentService, public router: Router) {
    this.userUpdated.emit(this.section);
  }

  setupTip() {

      if(this.user.status === 'none') {
        this.activeTip = this.tips[0]
      } else if (this.user.status === 'waiting') {
        this.activeTip = this.tips[1]
      } else if (this.user.status === 'study') {
        this.activeTip = this.tips[2]
      } else {
        this.hiddenTip = true
      }



  }

  ngOnInit() {
    this.af.auth.subscribe(user=>{

      this.af.database.object("designers/" + user.uid, {preserveSnapshot: true}).take(1).subscribe(snapshot=>{

        this.user = snapshot.val()
        this.setupTip()

        var lectureList = this.af.database.list("environment/userLectures/" + this.user.id, { preserveSnapshot: true, query: {
          orderByKey: true
        } })

        lectureList.subscribe(snapshot => {
          snapshot.forEach(snapshot => {
            var hwStatus = snapshot.val()

            var lectureRef = this.af.database.object("environment/lectures/" + snapshot.key, {preserveSnapshot: true}).take(1)
            lectureRef.subscribe(snapshot=>{
              var lecture = snapshot.val()
              lecture["hwStatus"] = hwStatus

              var found = this.lectures.some(el => {
                return el.week === snapshot.val().week;
              });

              if(!found) {
                if(this.lectures.length <= 8) {
                  this.lectures.push(lecture)
                } else {
                  this.instructions.push(lecture)
                }
              }

              setTimeout(()=> {
                if(this.instructions.length > 0) {
                  this.selectedLecture = this.instructions[0]
                } else {
                  this.selectedLecture = this.lectures[this.lectures.length - 1]
                }

              }, 2000)


            })
          })
        })
      })
    })





  }

  ngOnChanges() {

  }


  showHomeWork() {
    this.homeWorkShow = true
  }

  showLecture(val) {
    this.homeWorkShow = false
  }

  selectLecure(lecture) {
    this.selectedLecture = lecture
    this.homeWorkShow = false
  }

  onChange(event) {
    this.files = []
    var files = event.target.files;

    for(var i = 0, file; file=files[i];i++){
      this.files.push(file)
    }
  }

  saveHomework() {

    this.files.map((file, index)  => {
      var width;
      var height;
      var img = new Image();
      img.src = window.URL.createObjectURL( file );
      img.onload = function() {
        width = img.naturalWidth;
        height = img.naturalHeight;
      };

      var uploadTask = firebase.storage().ref("environment/homeworks/" + this.user.id + "/" + file.name).put(file);
      // Listen for upload completion.
      uploadTask.on('state_changed', function (snapshot) {

      }, function (error) {
        console.error('There was an error uploading a file to Firebase Storage:', error);
      }, function (snapshot) {
        var filePath = uploadTask.snapshot.downloadURL;
        firebase.database().ref("environment/homeWorks/" + this.user.id + "/" + this.selectedLecture.week).update({imgUrl: filePath.toString(), imageWidth: width, imageHeight: height, timestamp: Math.round(new Date().getTime()/1000)});

        //open new lecture
        if (this.selectedLecture.week < 8) {
          var newWeek = this.selectedLecture.week + 1
          this.env.openNewLecture(newWeek, this.user.id)
        }

        if (this.selectedLecture.week === 8) {
          this.af.database.object("designers/" + this.user.id).update({ status: "waiting" })
          var request = {}
          request[this.user.id] = 1
          this.af.database.object('environment/requests/').update(request)
          this.activeTip = this.tips[1]
        }

        //set old lecture status "done"
        var value = {}
        value[this.selectedLecture.week] = "done"
        firebase.database().ref("environment/userLectures/" + this.user.id).update(value)

        this.selectedLecture.hwStatus = "done"

        this.files.splice(index,1);
      }.bind(this));

    })

  }





}
