import { Component } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take'

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public isHidden() {
    let list = ["/upload-file"],
        route = this.location.path();

    return (list.indexOf(route) > -1);
  }

  userLogged: boolean = false;
  menu;
  subLogo;

  constructor(public af: AngularFire, private router:Router, public location: Location) {
    this.initializeApp();
  }

  initializeApp() {

    var authRef = this.af.auth.subscribe(user => {
      if(user) {

        let userRef = this.af.database.object('designers/' + user.uid, { preserveSnapshot: true }).take(1)
        userRef.subscribe(snapshot => {
          // console.log(snapshot.val().status)
          var status = snapshot.val().status
          if (status === 'none' || status === 'waiting') {
            this.subLogo = "Лакмус"
            this.menu = [
              {
                url: '/select',
                title: 'Статьи',
                disabled: false
              },
              {
                url: '/how-work',
                title: 'Инструкции',
                disabled: true
              },
              {
                url: '/tasks',
                title: 'Задачи',
                disabled: true
              },
            ]
            this.router.navigate(['/select'])
          } else if (status === 'study') {
            this.subLogo = "Пульс"
            this.menu = [
              {
                url: '/select',
                title: 'Статьи',
                disabled: false
              },
              {
                url: '/how-work',
                title: 'Инструкции',
                disabled: false
              },
              {
                url: '/tasks',
                title: 'Задачи',
                disabled: true
              },
            ]
            this.router.navigate(['/how-work']);

          } else {
              this.subLogo = ""
              this.menu = [
                {
                  url: '/tasks',
                  title: 'Задачи',
                  disabled: false
                },
              ]
              this.router.navigate(['/tasks']);
            }
          authRef.unsubscribe()
        });

      }
    })



  }

}
