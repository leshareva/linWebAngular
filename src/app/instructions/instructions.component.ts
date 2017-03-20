import { Component, OnInit } from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import 'rxjs/add/operator/take'

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  approveHidden: boolean = true;

  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(user=>{
      if(user) {
        this.af.database.object("designers/" + user.uid, {preserveSnapshot: true}).take(1).subscribe(snapshot=>{
          if(snapshot.val().status === 'study')
            this.approveHidden = false
          else
            this.approveHidden = true
        })
      } else {
        // user not logged in
        console.log("user not logged in")
        this.router.navigate(['/'])
      }

    })
  }

  ngOnInit() {
  }


  startWork() {
    this.af.auth.subscribe(user=>{
      this.af.database.object("designers/" + user.uid).update({status: 'free', rate: 0.3})
      this.router.navigate(['/tasks'])
    })

  }
}
