import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {AngularFire} from "angularfire2";
import {AuthService} from "../auth.service";
import {EmailValidator} from "../validators/email"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public submitAttempt: boolean = false;
  showError: boolean = false;
  errorText: string;
  constructor(private auth: AuthService,
              private af: AngularFire,
              private router: Router,
              private _fb: FormBuilder,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, EmailValidator.isValid]],
      password: ['', [Validators.required]]
    });

  }


  onSubmit(formData) {
    this.submitAttempt = true;
    var creds: any = {email: formData.email, password: formData.password};
    this.af.auth.login(creds).then((res) => {
      console.log(res);

      let userRef = this.af.database.object('designers/' + res.uid, { preserveSnapshot: true }).take(1)
      userRef.subscribe(snapshot => {

        var status = snapshot.val().status
        if (status === 'none' || status === 'waiting' || status === 'study') {
          this.router.navigate(['/select'])
        } else {
          this.router.navigate(['/tasks']);
        }

      });


    }).catch((error) => {
      console.log(error);
      this.showError = true
      if (error["code"] === "auth/user-not-found")
        this.errorText = "Нет такого емэйла в базе"
      else if (error["code"] === "auth/wrong-password")
        this.errorText = "Неверный пароль"
    });;
  }

}
