import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {TaskService} from "../../../services/task.service";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {FileUploader} from "ng2-file-upload";

@Component({
  selector: 'tasks-upload-concept',
  templateUrl: './upload-concept.component.html',
  styleUrls: ['./upload-concept.component.css']
})
export class UploadConceptComponent implements OnInit, OnChanges {



  server = this.taskService.SERVER_URL
  public uploader:FileUploader = new FileUploader({url: this.server + '/saveFiles'});
  mokups: FirebaseListObservable<any[]>;
  @Input() task;
  files = [];
  uploadFormHidden = false;
  conceptStatus;
  title;
  tempClient: boolean;

  constructor(private taskService: TaskService, private af: AngularFire) { }

  ngOnChanges() {
    this.uploader.onBuildItemForm = (item, form) => {
      form.append("taskId", this.task.taskId);
      // form.append("status", "concept");
    };


    this.af.database.object("tasks/" + this.task.taskId, { preserveSnapshot: true }).subscribe(snapshot => {
      this.task = snapshot.val()
      if (snapshot.val().status === "concept") {
        this.title = "Выгрузите черновики"
      } else if (snapshot.val().status === "conceptApprove") {
        this.uploadFormHidden = true
        this.title = "Ждем подтверждение от клиента"
      } else if (snapshot.val().status === "design") {
        this.title = "Выгрузите чистовики"
      } else if (snapshot.val().status === "designApprove"){
        this.uploadFormHidden = true
        this.title = "Ждем подтверждение от клиента"
      }
    })

    this.mokups = this.af.database.list("tasks/" + this.task.taskId + "/concept")
    this.af.database.object("tasks/" + this.task.taskId + "/concept", { preserveSnapshot: true }).subscribe(snap => {
      if(snap.val().status != null) {
        switch (snap.val().status) {
          case "unread":
            this.conceptStatus = "Не прочитано"
            break;
          case "read":
            this.conceptStatus = "Клиент изучает черновик"
            break;
          case "discuss":
            this.conceptStatus = "Клиент хочет обсудить черновик"
            break;
        }
      }

    })

  }


  editConcept() {
    this.uploadFormHidden = false
  }

  onChange(event) {
    var files = event.target.files;
    for(var i = 0, file; file = files[i]; i++) {
      this.files.push(file)
    }

  }



  uploadFile() {
    if(this.tempClient === false) {
      if (this.task.status === "concept" || this.task.status === "conceptApprove") {
        this.taskService.uploadFile("concept", this.task.taskId, this.files)
        let newStatus = "conceptApprove"
        this.taskService.updateTaskStatus(this.task.taskId, newStatus)
        this.af.database.object("tasks/" + this.task.taskId + "/concept").update({status: "unread"})
      } else if (this.task.status === "design" || this.task.status === "designApprove") {
        this.taskService.uploadFile("design", this.task.taskId, this.files)
        let newStatus = "designApprove"
        this.taskService.updateTaskStatus(this.task.taskId, newStatus)
        this.af.database.object("tasks/" + this.task.taskId + "/design").update({status: "unread"})
      }

      setTimeout(()=>{
        this.taskService.sendPush("Согласуйте результаты этапа", this.task.fromId, this.task.taskId)
      }, 3000)

    } else {
      this.taskService.workDone({ taskId: this.task.taskId })
      this.files = []
    }






  }

  deleteFile(file) {
   this.files = []

  }

  ngOnInit() {
    var clientId = this.task.fromId
    var cut = clientId.substring(0, 3);

    if (cut === 'tmp')
      this.tempClient = true
    else
      this.tempClient = false
  }




}
