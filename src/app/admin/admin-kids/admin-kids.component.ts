import {Component, OnInit, PipeTransform, QueryList, ViewChildren} from '@angular/core';
import {ChristmasPresentsService} from '../../christmas-presents.service';
import {Kid} from '../../kid/kid';
import {FormControl} from '@angular/forms';
import {map, Observable, pipe, startWith} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import * as _ from 'lodash';

import {NgbdSortableHeader, SortEvent} from '../../shared/sortable-directive';

const compare = (v1: string | number | boolean, v2: string | number | boolean) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-admin-kids',
  templateUrl: './admin-kids.component.html',
  styleUrls: ['./admin-kids.component.css']
})
export class AdminKidsComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  closeResult = '';
  private Kids: Kid[];
  FilteredKids: Kid[];
  FormKid: Kid;
  filter: string = '';
  action: string = '';

  constructor(private presentsService: ChristmasPresentsService,
              public pipe: DecimalPipe,
              private modalService: NgbModal,
              private router: Router) {
    this.Kids = [];
    this.FilteredKids = [];
    this.FormKid = new Kid();
    this.headers = new QueryList<NgbdSortableHeader>();
  }

  ngOnInit(): void {
    this.loadKids();
  }

  loadKids(): void {
    this.presentsService.getKidsList(true).subscribe((response: Kid[]) => {
      this.Kids = response;
      this.FilteredKids = this.Kids;
    });
  }

  applyFilter() {
    this.FilteredKids = this.Kids.filter(kid => {
      const term = this.filter.toLowerCase();
      return kid.name.toLowerCase().includes(term) ||
        kid.area.toLowerCase().includes(term) ||
        kid.present.name.toLowerCase().includes(term) ||
        kid.age.toString().toLowerCase().includes(term);
    });
  }

  search() {
    this.applyFilter();
  }

  resetSearch() {
    this.FilteredKids = this.Kids;
  }

  editKid(content: any, selectedKid: Kid) {
    this.FormKid = selectedKid;
    this.action = 'Editar';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.presentsService.updateKid(this.FormKid).subscribe((response: any) => {
        console.log(response);
      });
      console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  clickBack(): void {
    this.router.navigate(['/admin']);
  }

  addKid(content: any): void {
    this.action = 'Agregar';
    this.FormKid = new Kid();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.presentsService.addKid(this.FormKid).subscribe((response: any) => {
        this.loadKids();
      });
    });
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.Kids = _.cloneDeep(this.Kids.sort((k1: Kid, k2: Kid) => {
      let result: number;

      if (column == 'present') {
        result = compare(k1.present.name, k2.present.name);
        return direction === 'asc' ? result : -result;
      } else if (column == 'name') {
        result = compare(k1.name, k2.name);
        return direction === 'asc' ? result : -result;
      } else if (column == 'area') {
        result = compare(k1.area, k2.area);
        return direction === 'asc' ? result : -result;
      } else if (column == 'age') {
        result = compare(k1.age, k2.age);
        return direction === 'asc' ? result : -result;
      } else if (column == 'hidden') {
        result = compare(k1.hidden, k2.hidden);
        return direction === 'asc' ? result : -result;
      } else return 1;
    }));
    this.applyFilter();
  }
}
