import {Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild, OnChanges} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import { UserService } from '../../../services/user.service'
import * as firebase from 'firebase';
import {TaskService} from "../../../services/task.service";


@Component({
  selector: 'tasks-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],

})
export class ChatComponent implements OnChanges {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() client: FirebaseObjectObservable<any>;
  @Input() task;
  @Input() user;
  chat = [];
  public messageText;
  public disable: boolean = true
  public name = "коля";

  constructor(public af: AngularFire, public userService: UserService, public taskService: TaskService) {

  }


  sendMessage(taskId: string, message: string, input: HTMLInputElement) {
    if (input.value.length > 1) {

        var values = {
          fromId: this.user.id,
          text: message,
          timestamp: Math.round(new Date().getTime()/1000)
        }

        this.chat.push(values)

        let messageKey = this.af.database.list('messages').push(values).key;
        let messVal = {};
        messVal[messageKey] = 1;
        this.af.database.object('task-messages/' + taskId).update(messVal);
       this.af.database.object("clients/" + this.task.fromId + "/unread/" + taskId).update(messVal)
        input.value = null;
        this.taskService.sendPush(message, this.task.fromId, this.task.taskId)
      }

  }


  keyDownFunction(event, taskId, messageText, something) {
    if(event.keyCode == 13) {
      this.sendMessage(taskId, messageText, something)
    }
  }

  onChange(event, taskId) {

    var messKey = "";
    let messVal = {};

    var file = event.target.files[0];
    var width, height;
    var img = new Image();
    img.src = window.URL.createObjectURL( file );
    img.onload = function() {
      width = img.naturalWidth;
      height = img.naturalHeight;
    };

      let messageData = this.af.database.list('messages').push({
        taskId: taskId,
        fromId: this.user.id,
        timestamp: Math.round(new Date().getTime()/1000)
      })


      messKey = messageData.key;

      // Upload the image to Firebase Storage.
      var uploadTask = firebase.storage().ref(this.user.id + '/' + Date.now() + '/' + file.name)
        .put(file, {'contentType': file.type});
      // Listen for upload completion.
      uploadTask.on('state_changed', null, function(error) {
        console.error('There was an error uploading a file to Firebase Storage:', error);
      }, function() {

        // Get the file's Storage URI and update the chat message placeholder.
        var filePath = uploadTask.snapshot.downloadURL;
        this.af.database.object('messages/' + messKey).update({imageUrl: filePath.toString(), imageWidth: width, imageHeight: height });
        messVal[messKey] = 1;
        this.af.database.object('task-messages/' + taskId).update(messVal)

        messageData["imageUrl"] = filePath.toString()
        messageData["imageWidth"] = width
        messageData["imageHeight"] = height.toString()

        // this.chat.push(messageData)

      }.bind(this));



  }


  ngOnChanges() {

    this.user = this.user
    console.log(this.user)
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
  }

}
