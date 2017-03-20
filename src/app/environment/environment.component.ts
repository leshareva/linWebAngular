import { Component, OnInit } from '@angular/core';
import {AngularFire} from "angularfire2";
import {User} from "../Models/new-user.interface";
import 'rxjs/add/operator/take'
import {Observable} from 'rxjs/Rx';
import {Router} from "@angular/router";

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit {
  userStarting: boolean = false;
  user: User;
  public lectures = [];
  homePage = "/select"
  subLogo;



  constructor(public af: AngularFire, public router: Router) {

    var authRef = this.af.auth.subscribe(user => {
      if (user) {
        this.userStarting = true;
        var userRef = this.af.database.object("designers/" + user.uid,
        { preserveSnapshot: true }).take(1);

        userRef.subscribe(snapshot => {
          this.user = snapshot.val()
          // authRef.unsubscribe()
        })
      } else {
        this.router.navigate(['/login'])
      }

    })

  }

  handleUserUpdated(title) {
    console.log(title)
    this.subLogo = title
  }

  ngOnInit() {
  }

}
