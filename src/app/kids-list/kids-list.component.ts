import { Component, OnInit } from '@angular/core';
import {Kid} from '../kid/kid';
import {ChristmasPresentsService} from '../christmas-presents.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-kids-list',
  templateUrl: './kids-list.component.html',
  styleUrls: ['./kids-list.component.css']
})
export class KidsListComponent implements OnInit {
  kids: Kid[];

  public constructor(private apiService: ChristmasPresentsService, private router: Router) {
    this.kids = [];
    this.LoadList();
  }

  ngOnInit() {
  }

  private LoadList() {
    this.apiService.getKidsList(false).subscribe((response: Kid[]) => {
      this.kids = response;
    });
  }

  goToKidDetails(kid: Kid) {
    localStorage.setItem('selectedKid', JSON.stringify(kid));
    this.router.navigate(['/chicos/detalle']);
  }
}
