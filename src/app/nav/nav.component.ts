import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Location} from "@angular/common";
import { AuthService } from '../auth.service';
import 'rxjs/add/operator/take'
import {Observable} from 'rxjs/Rx';
import {Router} from "@angular/router";
import {User} from "../Models/new-user.interface";


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnChanges {

  user = {}
  logo = "./assets/logo.png"
  authRef;

  @Input() homeUrl;
  @Input() subLogo;
  @Input() menu = []

  public isHidden() {
    let list = ["/login"],
        route = this.location.path();

    return (list.indexOf(route) > -1);
  }

  constructor(public af: AngularFire, private _auth: AuthService, public _router: Router, public location: Location) {}



  ngOnInit() {
     this.authRef = this.af.auth.subscribe(user=>{
      if(user) {
        this.af.database.object("designers/" + user.uid, {preserveSnapshot: true}).take(1).subscribe(snapshot=>{
          this.user = snapshot.val()
        })
      } else {
        this.user = null
      }
    })

  }

  ngOnChanges() {
    this.authRef = this.af.auth.subscribe(user=>{
      if(user) {
        this.af.database.object("designers/" + user.uid, {preserveSnapshot: true}).take(1).subscribe(snapshot=>{
          this.user = snapshot.val()
        })
      } else {
        this.user = null
      }
    })
  }

  login() {
    this._router.navigate(['/login'])
  }

  logout() {
    this.user = null
    this.authRef.unsubscribe()
    this._auth.signOut()
    this._router.navigate(['/'])
  }

  goToHome() {
      if (this.user["status"] === 'none' || this.user["status"] === 'waiting' || this.user["status"] === 'study') {
        this._router.navigate(['/select'])
      } else {
        this._router.navigate(['/tasks']);
      }
  }

}
