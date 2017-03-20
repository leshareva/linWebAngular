import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, FirebaseAuthState, AuthMethods } from 'angularfire2';
import {User} from "../Models/new-user.interface";
import {Constants} from "../constants";
import {Http} from "@angular/http";

@Injectable()

export class UserService {


  public userId: string;
  public user: any;
  public SERVER_URL;
  public headers;

  constructor(public af: AngularFire, public constants: Constants, private http: Http) {
    this.SERVER_URL = this.constants.SERVER_URL
    this.headers = this.constants.Headers
  }

  getUser() {
    this.af.auth.subscribe(user => {
      this.userId = user.uid
      let ref = this.af.database.object("designers/" + this.userId, {preserveSnapshot: true})
      ref.subscribe(snapshot => {
        this.user = snapshot.val()
      });
    });
    return this.user
  }


  createUser(user: User) {
    let body = JSON.stringify( user )

    this.http
        .post(this.SERVER_URL + "/sign-up", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)
              body = undefined
            }
        )
  }

  signupUser(newEmail: string, newPassword: string): any {
    return this.af.auth.createUser({ email: newEmail, password: newPassword });
  }

}
