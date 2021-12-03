import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {Kid} from '../../kid/kid';
import {PresentGiver} from '../../kid-details/present-giver';
import {ChristmasPresentsService} from '../../christmas-presents.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbdSortableHeader, SortEvent} from '../../shared/sortable-directive';
import * as _ from 'lodash';

const compare = (v1: string | number | boolean, v2: string | number | boolean) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-admin-givers',
  templateUrl: './admin-givers.component.html',
  styleUrls: ['./admin-givers.component.css']
})
export class AdminGiversComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  filter: string = '';
  private Givers: PresentGiver[];
  FilteredGivers: PresentGiver[];
  selectedLetter: string = '';
  closeResult = '';

  constructor(private presentsService: ChristmasPresentsService,
              private modalService: NgbModal,
              private router: Router) {
    this.Givers = [];
    this.FilteredGivers = [];
    this.headers = new QueryList<NgbdSortableHeader>();
  }

  ngOnInit(): void {
    this.loadGivers();
  }

  loadGivers(): void {
    this.presentsService.getPresentGiversList().subscribe((response: PresentGiver[]) => {
      this.Givers = response;
      this.FilteredGivers = this.Givers;
    });
  }

  clickBack(): void {
    this.router.navigate(['/admin']);
  }

  search() {
    this.applyFilter();
  }

  resetSearch() {
    this.FilteredGivers = this.Givers;
  }

  applyFilter() {
    this.FilteredGivers = this.Givers.filter(giver => {
      const term = this.filter.toLowerCase();
      return giver.contactEmail?.toLowerCase().includes(term) ||
        giver.contactPhone?.toLowerCase().includes(term) ||
        giver.present?.kid?.name?.includes(term) ||
        giver.paymentMethod?.toLowerCase().includes(term) ||
        giver.present?.kid?.area?.toLowerCase().includes(term);
    });
  }

  onSort({column, direction}: SortEvent) {
    console.log(column);
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.Givers = _.cloneDeep(this.Givers.sort((g1: PresentGiver, g2: PresentGiver) => {
      let result: number;


      if (column == 'name') {
        result = compare(g1.name, g2.name);
        return direction === 'asc' ? result : -result;
      }
      else if (column == 'paymentMethod') {
        result = compare(g1.paymentMethod, g2.paymentMethod);
        return direction === 'asc' ? result : -result;
      } else if (column == 'kidName') {
        result = compare(g1.present.kid.name, g2.present.kid.name);
        return direction === 'asc' ? result : -result;
      } else if (column == 'kidArea') {
        result = compare(g1.present.kid.area, g2.present.kid.area);
        return direction === 'asc' ? result : -result;
      }
      else return 1;
    }));
    this.applyFilter();
  }

  showLetter(content: any, letter: string) {
    this.selectedLetter = letter;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
}
