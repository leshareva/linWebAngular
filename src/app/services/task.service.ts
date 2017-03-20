import { Injectable } from "@angular/core";
import { Task } from '../tasks/task';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UserService } from './user.service';
import * as firebase from 'firebase';
import {Headers, Http} from "@angular/http";
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import {Constants} from "../constants";

@Injectable()

export class TaskService {

  public taskStatus;
  public task: FirebaseObjectObservable<any>;
  public userId;
  public tasks =[];
  public awareness;
  public SERVER_URL;
  private headers;

  constructor(public af:AngularFire, public userService: UserService, private http: Http, public constants: Constants) {
   this.SERVER_URL = this.constants.SERVER_URL
    this.headers = this.constants.Headers
  }

  getTaskStatus(taskId) {
    let task = this.af.database.object('tasks/' + taskId, { preserveSnapshot: true })
    task.subscribe(snapshot => {
       this.taskStatus = snapshot.val().status
    })
    return this.taskStatus
  }

  getAwareness(taskId) {
    return  this.af.database.object('tasks/' + taskId + "/awareness", { preserveSnapshot: true })
  }

  getClientInfo(userId) {
    this.af.database.object('clients/' + userId, { preserveSnapshot: true })
  }

  getTasksList() {

  }

  getTask(taskId) {
    return this.task = this.af.database.object('tasks/' + taskId)
  }

  cancelTask(taskId) {
    this.af.database.object('designers/' + this.userId + "/inbox/" + taskId).remove()
  }



  uploadFile(status, taskId, files) {
    var statusRef = firebase.database().ref("tasks/" + taskId + "/" + status)

    statusRef.remove()

    files.map(function (file, index)  {
      var width;
      var height;
      var img = new Image();
      img.src = window.URL.createObjectURL( file );
      img.onload = function() {
        width = img.naturalWidth;
        height = img.naturalHeight;
      };

      // setInterval(function () {
      //
      // })
      console.log(file)
      var uploadTask = firebase.storage().ref(taskId + '/' + file.name).put(file);
      // Listen for upload completion.
      uploadTask.on('state_changed', function (snapshot) {

      }, function (error) {
        console.error('There was an error uploading a file to Firebase Storage:', error);
      }, function (snapshot) {
        var filePath = uploadTask.snapshot.downloadURL;
        firebase.database().ref("tasks/" + taskId + "/" + status).push({imgUrl: filePath.toString(), imageWidth: width, imageHeight: height});
        files.splice(index,1);
      }.bind(this));

    })

    statusRef.update({ status: "unread" })

  }


    updateTask(taskId, status): Promise<any> {
        let body = JSON.stringify({taskId: taskId, status: status})

        return this.http
            .post(this.SERVER_URL + "/tasks/update", body, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

  updateTaskStatus(taskId, status) {
    let ref = this.af.database.object('tasks/' + taskId)
    ref.update({status: status})
  }


  acceptTask(taskId, userId) {
    let body = JSON.stringify({taskId: taskId, status: "awareness", userId: userId})

    this.http
        .post(this.SERVER_URL + "/tasks/update", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
              response => {
                console.log(response)
                body = undefined
              }
          )
  }



  handleError(error) {
    console.log(error);
    return error.json().message || 'Server error, please try again later';
  }



  sendPrice(time, taskId){
    this.af.database.object('tasks/' + taskId).update({time: +time})
    let body = JSON.stringify({time: time, taskId: taskId})

    this.http
        .post(this.SERVER_URL + "/getprice", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)
              body = undefined
            }
        )
  }


  sendPush(message, toId, taskId){
    let body = JSON.stringify({message: message, userId: toId,  taskId: taskId})

    this.http
        .post(this.SERVER_URL + "/push", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)
              body = undefined
            }
        )
  }

  rejectTask(taskId) {
    let body = JSON.stringify({taskId: taskId,  subject: "reject"})

    this.http
        .post(this.SERVER_URL + "/tasks", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)
              body = undefined
            }
        )
  }

  workDone(params) {
    var body = JSON.stringify(params)
    this.http
        .post(this.SERVER_URL + "/workdone", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)
              body = undefined
            }
        )
  }


  archiveTask(taskId) {
    var body = JSON.stringify({taskId: taskId})
    this.http
        .post(this.SERVER_URL + "/closeTask", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)
              body = undefined
            }
        )
  }

}
