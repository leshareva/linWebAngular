import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {TaskService} from "../../../services/task.service";


@Component({
  selector: 'tasks-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})


export class PriceComponent implements OnInit, OnChanges {
  @Input() task;
  @Input() user;
  @Input() clientRate;
  price;
  someRange
  priceFormHidden: boolean = true
  stage: string = "Тяните слайдер, чтобы сделать оценку";
  payLink;

  time: number = 0;
  tempClient: boolean;
  constructor(private af: AngularFire, private taskService: TaskService) {

  }

  ngOnInit() {




  }

  ngOnChanges() {
    this.af.database.object("tasks/" + this.task.taskId, {preserveSnapshot: true}).subscribe(snapshot=>{
      this.task = snapshot.val()

      var clientId = this.task.fromId
      // var cut = clientId.substring(0, 3);
      //
      // if (cut === 'tmp') {
      //   this.tempClient = true
      //   if(this.task.status === 'priceApprove') {
      //     this.generateLink()
      //   }
      // } else
      //   this.tempClient = false


    })


  }



  generateLink() {
    let orderId = Math.round(new Date().getTime()/1000)
    let price = Math.round(this.task.price)
    this.af.database.object('orders/' + orderId).update({ clientId: this.task.fromId, amount: price, taskId: this.task.taskId })
    this.payLink = "http://leandesign.pro:8100/pay?amount=" + price + "&orderId=" + orderId
  }

  sendPrice(time, taskId) {
    this.taskService.updateTask(taskId, "admin").then((result)=>{
        this.af.database.object("tasks/" + taskId).update({time: time})
    })

  }

  showPrice() {

  }






}
