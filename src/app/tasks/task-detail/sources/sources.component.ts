import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AngularFire } from 'angularfire2';
import {TaskService} from "../../../services/task.service";
import * as firebase from 'firebase'
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import {Ng2ImgMaxService} from "ng2-img-max";

declare var forEach: any;
declare var $: any;

@Component({
  selector: 'task-sources',
  template: `
                <div class="sourcesContainer" *ngIf="task.status === 'sources'">
                    <div class="row">
                        
                        <div class="col-md-12">
                            <h3>Выгрузите исходники</h3>
                            <p>Выберите файл исходника с компьютера. После прикрепите к нему джипег — исходник отправится автоматически.</p>
                            <form >
                                <div class="form-group">
                                    <label for="psd">PSD</label>
                                    <input type="file" class="form-control" accept=".psd,.ai,.eps,.sketch,.cdr" name="psd" ng2FileSelect [uploader]="uploader" multiple />
                                </div>  
                            </form>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
             
                            <table class="table">
                                <tbody>
                                <tr *ngFor="let item of uploader.queue; let i = index">
                                    <td><strong>{{ item.file.name }}</strong><br />{{ item.file.size/1024/1024 | number:'.2' }} MB</td>
                                    <td style="min-width: 150px">
                                        <div class="progress" style="margin-bottom: 0;">
                                            <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span *ngIf="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span>
                                        <span *ngIf="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span>
                                        <span *ngIf="item.isError"><i class="glyphicon glyphicon-remove"></i></span>
                                    </td>
                                    
                                    <td id="input-{{ i }}">
                                    <!--<input type="file" name="file-{{ i }}[]" id="file-{{ i }}" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" image-upload (imageSelected)="selected($event, i)" [resizeOptions]="resizeOptions" multiple />-->
                                        <input type="file" name="file-{{ i }}[]" id="file-{{ i }}" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" (change)="selected($event, i)" multiple />
					                    <label for="file-{{ i }}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="white"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>Загрузите джипег</span></label>
                                    </td>
                                    <td id="remove-{{ i }}" nowrap>
                                        <button type="button" class="btn btn-danger btn-xs"
                                                (click)="removeItem(item, i)">
                                            <span class="glyphicon glyphicon-trash"></span> 
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <button class="btn btn_m btn_normal" *ngIf="uploader.queue.length > 0" (click)="sendSourcesToApprove()">Я все отправил</button>
                           
                        </div>
                    </div>
                </div>
                <div class="sourcesApprove" *ngIf="task.status === 'sourcesApprove'">
                    <h2 class="h2">Отлично</h2>
                    <p>Когда клиент проверит исходники, задача попадет в архив.</p>
                </div>
  `,
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnChanges, OnInit {
  public showUploadZone: boolean = false
  public uploader:FileUploader = new FileUploader({url:'http://leandesign.pro:8100/saveSources'});
  @Input() task: any;
  sourcesIsUploaded : boolean;
  message = "Каждый файл в двух форматах: jpg и исходник"

  jpgArray = []
  sourcesArray = []

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };


  src;
  tempClient: boolean;

  constructor(private af: AngularFire, public taskService: TaskService, private ng2ImgMaxService: Ng2ImgMaxService) {
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
      if (response == "Success") {
      }
    };
  }


  ngOnChanges() {



  }


  ngOnInit() {

    var clientId = this.task.fromId
    var cut = clientId.substring(0, 3);

    if (cut === 'tmp')
      this.tempClient = true
    else
      this.tempClient = false

  }

  selected(input, i) {
    var file = input.target.files[0]

    var img = document.createElement("img");
    var reader = new FileReader();
    reader.readAsDataURL(file);

    this.ng2ImgMaxService.resize([file], 800, 800).subscribe((result)=>{
      if (typeof result.name !== 'undefined' && typeof result.size !== 'undefined' && typeof result.type !== 'undefined') {
        //all good, result is a file
        console.info(result);
        this.loadJPG(result, i)

      }
      else {
        //something went wrong
        console.error(result);
      }
    });

  }


  loadJPG(file, i) {
    var width;
    var height;
    var img = new Image();
    img.src = window.URL.createObjectURL( file );
    img.onload = function() {
      width = img.naturalWidth;
      height = img.naturalHeight;
    };

    var uploadTask = firebase.storage().ref('tasks/' + this.task.taskId + '/sources/' + file.name).put(file);
    // Listen for upload completion.
    uploadTask.on('state_changed', function (snapshot) {

    }, function (error) {
      console.error('There was an error uploading a file to Firebase Storage:', error);
    }, function (snapshot) {
      var filePath = uploadTask.snapshot.downloadURL;

      var values = {
        thumbnailLink: filePath,
        name: file.name.substr(0, file.name.indexOf(".")),
        timestamp: Math.floor(Date.now() / 1000),
        width: width,
        height: height
      }

      var clientId = this.task.fromId

      var fileId = firebase.database().ref("files").push(values).key

      var fileVal = {}
      fileVal[fileId] = 1
      firebase.database().ref("userFiles/" + clientId).update(fileVal)
      firebase.database().ref("tasks/" + this.task.taskId + "/sources").update(fileVal)

      //send sources file to server
      this.uploader.onBuildItemForm = (item, form) => {
        form.append("fileId", fileId);
        form.append("taskId", this.task.taskId);
      };

      this.uploader.queue[i].upload()
      $("#input-" + i).hide();
      $("#remove-" + i).hide();


    }.bind(this));

  }

  sendSourcesToApprove() {
    if(this.tempClient === false) {
      // this.taskService.updateTaskStatus(this.task.taskId, "sourcesApprove")
      this.taskService.updateTask(this.task.taskId, "sourcesApprove")
      this.taskService.sendPush("Проверьте результаты задачи", this.task.fromId, this.task.taskId)
    } else {
      this.taskService.archiveTask(this.task.taskId)
    }

  }


  removeItem(item, i) {
    this.uploader.queue[i].remove()
  }




}
