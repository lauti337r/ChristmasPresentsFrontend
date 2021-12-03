import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ChristmasPresentsService} from '../../christmas-presents.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usernameValue: string = '';
  passwordValue: string = '';
  showIncorrectCredentialsAlert: boolean = false;

  constructor(private apiService: ChristmasPresentsService,
              private router: Router) { }

  ngOnInit(): void {
    console.log(123123123);
  }

  async login() {
    let header: string = '';
    header = `Basic ${btoa(`${this.usernameValue}:${this.passwordValue}`)}`;
    console.log(header);
    this.apiService.adminLogin(header).then((res) => {
      if (!res) {
        this.showIncorrectCredentialsAlert = true;
      } else {
        this.router.navigate(['/admin']);
      }
    });
  }
}
