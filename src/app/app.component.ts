import { Component } from '@angular/core';
import {ChristmasPresentsService} from './christmas-presents.service';
import {Kid} from './kid/kid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChristmasPresents';
}
