import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public subLogo = "Дизайн"
  homePage = "/"
  constructor(private _authService: AuthService) {  }

  ngOnInit() {
  }

  login() {

  }

}
