import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  clickKids() {
    this.router.navigate(['admin/chicos']);
  }

  clickGivers() {
    this.router.navigate(['admin/padrinos']);
  }
}
