import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {AngularFire} from "angularfire2";

@Component({
  selector: 'tasks-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnChanges {
  @Input() task;
  public isClassVisible: false;
  public title;
  public subtitle;

  constructor(public af: AngularFire) {

  }

  ngOnChanges() {
    this.af.database.object("tasks/" + this.task.taskId, {preserveSnapshot: true}).subscribe(snapshot => {
      let status = snapshot.val().status

      switch(status) {
        case "awareness":
          this.title = "Понимание";
          this.subtitle = "Разберитесь в задаче"
          break;
        case "awarenessApprove":
          this.title = "Понимание"
          this.subtitle = "Ждем когда клиент изучит понимание"
          break;
        case "price":
          this.title = "Сколько времени займет задача?";
          this.subtitle = "Сколько времени займет задача?"
          break;
        case "priceApprove":
          this.title = "Согласовываем оценку с клиентом";
          this.subtitle = "Посмотрим, подойдет ли это клиенту"
          break;
        case "concept":
          this.title = "Черновик"
          break;
        case "conceptApprove":
          this.title = "Черновик"
          this.subtitle = "Ждем согласование от клиента"
          break;
        case "design":
          this.title = "Чистовик"
          this.subtitle = "Подготовьте чистовик"
          break;
        case "designApprove":
          this.title = "Чистовик"
          this.subtitle = "Подготовьте чистовик"
          break;
        case "sources":
          this.title = "Исходники"
          this.subtitle = "Подготовьте исходники"
          break;
        case "sourcesApprove":
          this.title = "Готово!"
          this.subtitle = "Все готово, теперь задачу можно закрыть"
          break;

      }

    })



  }

}
