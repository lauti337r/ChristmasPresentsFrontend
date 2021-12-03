import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ChristmasPresentsService} from '../../christmas-presents.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private apiService: ChristmasPresentsService) { }

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['admin/login']);
    }
  }

  clickKids() {
    this.router.navigate(['admin/chicos']);
  }

  clickGivers() {
    this.router.navigate(['admin/padrinos']);
  }
}
