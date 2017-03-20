/**
 * Created by LeshaReva on 1/16/17.
 */
import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, FirebaseAuthState, AuthMethods } from 'angularfire2';
import {User} from "../Models/new-user.interface";
import {Constants} from "../constants";
import {Http} from "@angular/http";

@Injectable()

export class EnvironmentService {
    SERVER_URL;
    headers;

    constructor(public af:AngularFire, private http: Http, public constants: Constants) {
        this.SERVER_URL = this.constants.SERVER_URL
        this.headers = this.constants.Headers
    }


    openNewLecture(week, userId) {
        let body = JSON.stringify({week: week, userId: userId })

        this.http
            .post(this.SERVER_URL + "/homework", body, {headers: this.headers})
            .map(response => response.json())
            .subscribe(
                response => {
                    console.log(response)
                    body = undefined
                }
            )
    }

}