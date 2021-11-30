import {Component, Input, OnInit} from '@angular/core';
import { Kid } from './kid';

@Component({
  selector: 'app-kid',
  templateUrl: './kid.component.html',
  styleUrls: ['./kid.component.css']
})
export class KidComponent implements OnInit {

  @Input() Kid: Kid;

  constructor() {
    this.Kid = new Kid();
  }

  ngOnInit(): void {
  }

}
