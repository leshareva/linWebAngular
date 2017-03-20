import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, FirebaseAuthState, AuthMethods } from 'angularfire2';

@Injectable()

export class AuthService {

  private authState: FirebaseAuthState;
  public userId: string;

  constructor(public af: AngularFire) {

  }


  signOut(): void {
    this.af.auth.logout();
  }

}
