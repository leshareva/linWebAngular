import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements OnInit {
  @Input() tip: any;

  constructor() { }

  ngOnInit() {
  }

}
