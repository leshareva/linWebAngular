import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../../Models/new-user.interface";
import {UserService} from "../../services/user.service";
import { EmailValidator } from '../../validators/email';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";



@Component({
  selector: 'index-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  public newUserForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(private _fb: FormBuilder, public userService: UserService, private af: AngularFire, public router: Router) { }

  ngOnInit() {
    this.newUserForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required, EmailValidator.isValid]],
      password: ['', [Validators.required]],
      repeat: ['', [Validators.required]]
    });

  }


  saveUser(model: User, isValid: boolean) {
    this.submitAttempt = true

    if (isValid === true) {
      var pass = this.newUserForm.value.password
      console.log(pass)
      //save user info in db with status "study"
      this.userService.signupUser(model.email, pass).then( authData => {
        var user = {
          firstName: model.firstName,
          lastName: model.lastName,
          email: model.email,
          city: model.city,
          id: String(authData.uid),
          phone: model.phone,
          photoUrl: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
          sum: 0,
          rate: 0.01,
          status: "none",
          timestamp: Math.round(new Date().getTime()/1000)
        }
        this.userService.createUser(user)
        this.router.navigate(['/select'])
      })
    }
  }

}
