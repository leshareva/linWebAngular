import { Component, OnInit } from '@angular/core';
import {Constants} from "../constants";
import {} from 'psd'
import {ActivatedRoute, Params} from "@angular/router";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Http} from "@angular/http";


declare var Dropzone: any;
@Component({
  selector: 'app-new-file',
  templateUrl: './new-file.component.html',
  styleUrls: ['./new-file.component.css']
})
export class NewFileComponent implements OnInit {


  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]


  SERVER_URL
  userId
  inputPhone = ''
  headers
  user
  showDropzone: boolean = false
  error = "Ошибка";
  errorShow: boolean = false

  constructor(public constants: Constants, public route: ActivatedRoute, public af: AngularFire, private http: Http) {
    this.SERVER_URL = this.constants.SERVER_URL
    this.headers = this.constants.Headers
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      var userId = params['userId'];
        this.userId = userId

        Dropzone.options.uploadWidget = {
          init: function () {
            this.on('sending', (file, xhr, formData) => {

                console.log(userId);
                formData.append('userId', userId);

            });
          }
        }

    });


  }


  checkUser(phone) {
    var inputphone = phone.replace(/ /g,'')

    let body = JSON.stringify({userId: this.userId, phone: inputphone})

    this.http
        .post(this.SERVER_URL + "/get-user", body, {headers: this.headers})
        .map(response => response.json())
        .subscribe(
            response => {
              console.log(response)

                var user = response["user"]
                console.log(user['phone'], inputphone)
                if (user['phone'] === inputphone) {
                  this.showDropzone = true
                } else {
                  this.error = "Неверный номер телефона"
                  this.errorShow = true
                }


              body = undefined
            }
        )
  }

}
