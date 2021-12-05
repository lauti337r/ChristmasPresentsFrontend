import { Component, OnInit } from '@angular/core';
import {Kid} from '../kid/kid';
import {ChristmasPresentsService} from '../christmas-presents.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-kids-list',
  templateUrl: './kids-list.component.html',
  styleUrls: ['./kids-list.component.css']
})
export class KidsListComponent implements OnInit {
  kids: Kid[];
  spinnerTemplate = '<img src=\'assets/spinner.gif\' />';

  public constructor(private apiService: ChristmasPresentsService,
                     private router: Router,
                     private spinner: NgxSpinnerService) {
    this.kids = [];
    this.LoadList();
  }

  ngOnInit() {
  }

  private LoadList() {
    this.spinner.show('KidsListSpinner');
    this.apiService.getKidsList(false).subscribe((response: Kid[]) => {
      this.kids = response;
      this.spinner.hide('KidsListSpinner');
    });
  }

  goToKidDetails(kid: Kid) {
    localStorage.setItem('selectedKid', JSON.stringify(kid));
    this.router.navigate(['/chicos/detalle']);
  }
}
