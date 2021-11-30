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
  }

  login() {
    let header: string = '';
    header = `Basic ${btoa(`${this.usernameValue}:${this.passwordValue}`)}`;
    console.log(header);
    let loginSuccess = this.apiService.adminLogin(header);
    if (!loginSuccess) {
      this.showIncorrectCredentialsAlert = true;
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
