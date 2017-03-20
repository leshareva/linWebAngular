import {Component, OnInit, Input, OnChanges, Output, EventEmitter, AfterViewInit, OnDestroy} from '@angular/core';
import {FirebaseObjectObservable, AngularFire} from "angularfire2";
import {TaskService} from "../../../services/task.service";
import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';


@Component({
  selector: 'tasks-awareness',
  templateUrl: './awareness.component.html',
  styleUrls: ['./awareness.component.css']
})

export class AwarenessComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {

  @Input() task;
  @Input() user;

  tempClient: boolean;

  editor;

  @Output() onEditorKeyup = new EventEmitter<any>();
  awarenessStatus;
  awareness = {
    text: "",
    status: ""
  };

  awarenessValue


  constructor(public taskService: TaskService, public af: AngularFire) {



  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#awarenessField',
      plugins: ['link', 'table'],
      skin_url: 'assets/skins/lightgray',
      inline: true,
      paste_data_images: true,
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
          // this.awarenessValue = content
        });
      },
    });

  }



  ngOnDestroy() {
    // tinymce.remove(this.editor);
  }

  keyupHandlerFunction(event) {
    this.awareness.text = event
  }

  sendAwareness() {
    if (this.awareness.text) {

        this.taskService.updateTask(this.task.taskId, "awarenessApprove").then((result) => {
          let ref = this.af.database.object('tasks/' + this.task.taskId + "/awareness")
            ref.update({text: this.awareness.text}).then(()=>{
              this.taskService.sendPush("Согласуйте понимание задачи", this.task.fromId, this.task.taskId)
            })
        })
    } else {
      console.log('awareness field is empty')
    }
  }



  editAwareness() {
    this.task.status = "awareness"
  }

  ngOnChanges() {

    this.task = this.task
    //get Awareness
    this.taskService.getAwareness(this.task.taskId).subscribe(snapshot => {

      if (snapshot.val() !== null)
        this.awareness = snapshot.val()

        switch (this.awareness.status) {
          case "unread":
            this.awarenessStatus = "Не прочитано";
            break;
          case "read":
            this.awarenessStatus = "Прочитано";
            break;
          case "discuss":
            this.awarenessStatus = "Клиент хочет уточнить понимание";
            break;
        }
    })

  }

  ngOnInit() {
    var clientId = this.task.fromId
    var cut = clientId.substring(0, 3);
    console.log(cut)
    if (cut === 'tmp')
      this.tempClient = true
    else
      this.tempClient = false
  }

}
