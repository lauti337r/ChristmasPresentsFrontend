import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {Kid} from '../../kid/kid';
import {PresentGiver} from '../../kid-details/present-giver';
import {ChristmasPresentsService} from '../../christmas-presents.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbdSortableHeader, SortEvent} from '../../shared/sortable-directive';
import * as _ from 'lodash';
import {NgxSpinnerService} from 'ngx-spinner';
import * as XLSX from 'xlsx';

type AOA = any[][];

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
              private router: Router,
              private spinner: NgxSpinnerService) {
    this.Givers = [];
    this.FilteredGivers = [];
    this.headers = new QueryList<NgbdSortableHeader>();
  }

  ngOnInit(): void {
    this.loadGivers();
  }

  loadGivers(): void {
    this.spinner.show('AdminGiversSpinner');
    this.presentsService.getPresentGiversList().subscribe((response: PresentGiver[]) => {
      this.Givers = response.sort((g1: PresentGiver, g2: PresentGiver) => {
        if (g1.presentGiverId > g2.presentGiverId) {
          return -1;
        } else {
          return 1;
        } });
      this.FilteredGivers = this.Givers;
      this.spinner.hide('AdminGiversSpinner');
    });
  }

  clickBack(): void {
    this.router.navigate(['/admin']);
  }

  search() {
    this.applyFilter();
  }

  resetSearch() {
    this.FilteredGivers = this.Givers.sort((g1: PresentGiver, g2: PresentGiver) => {
      if (g1.presentGiverId > g2.presentGiverId) {
        return -1;
      } else {
        return 1;
      } });
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


      if (column == 'presentGiverId') {
        result = compare(g1.presentGiverId, g2.presentGiverId);
        return direction === 'asc' ? result : -result;
      } else if (column == 'name') {
        result = compare(g1.name, g2.name);
        return direction === 'asc' ? result : -result;
      } else if (column == 'paymentMethod') {
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

  setPayment(presentGiver: PresentGiver) {
    this.spinner.show('AdminGiversSpinner');
    this.presentsService.setPayment(presentGiver.presentGiverId).subscribe((response: any) => {
      presentGiver.paymentMade = 1;
      this.spinner.hide('AdminGiversSpinner');
    });
  }

  unsetPayment(presentGiver: PresentGiver) {
    this.spinner.show('AdminGiversSpinner');
    this.presentsService.unsetPayment(presentGiver.presentGiverId).subscribe((response: any) => {
      presentGiver.paymentMade = 0;
      this.spinner.hide('AdminGiversSpinner');
    });
  }

  deleteGiver(presentGiver: PresentGiver) {
    this.spinner.show('AdminGiversSpinner');
    if (confirm('Esta acción eliminará al padrino y volverá a mostrar al chico en la lista. Continuar?')) {
      this.presentsService.deleteGiver(presentGiver.presentGiverId).subscribe((response: any) => {
        presentGiver.paymentMade = 0;
        this.spinner.hide('AdminGiversSpinner');
      }, (error: any) => { }, () => {
        this.spinner.hide('AdminGiversSpinner');
      });
    } else {
      this.loadGivers();
      this.spinner.hide('AdminGiversSpinner');
    }
  }
  exportToSpreadsheet() {
    this.spinner.show('AdminGiversSpinner');
    const rows: AOA[] = this.processData();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Padrinos');

    /* save to file */
    XLSX.writeFile(wb, 'Padrinos' + Date.now() + '.xlsx');
    this.spinner.hide('AdminGiversSpinner');
  }

  processData(): AOA {
    let rows: AOA = [];
    //Nombre	Telefono	E-mail	Carta	Metodo de pago	Número de carta	Apadrinado	Barrio	Regalo	Monto
    rows.push(['Nombre', 'Telefono', 'E-mail', 'Carta', 'Metodo de pago', 'Pago confirmado', 'Numero de Carta', 'Apadrinado', 'Barrio', 'Regalo', 'Negocio', 'Monto']);
    for (let i = 0; i < this.Givers.length; i++) {
      rows.push([this.Givers[i].name,
                  this.Givers[i].contactPhone,
                  this.Givers[i].contactEmail,
                  this.Givers[i].letter,
                  this.Givers[i].paymentMethod,
                  this.Givers[i].paymentMade == 1 ? 'Si' : 'No',
                  this.Givers[i].present != null && this.Givers[i].present.kid != null ? this.Givers[i].present.kid.number : '',
                  this.Givers[i].present != null && this.Givers[i].present.kid != null ? this.Givers[i].present.kid.name : '',
                  this.Givers[i].present != null && this.Givers[i].present.kid != null ? this.Givers[i].present.kid.area : '',
                  this.Givers[i].present != null ? this.Givers[i].present.name : '',
                  this.Givers[i].present != null ? this.Givers[i].present.shopName : '',
                  this.Givers[i].present != null ? this.Givers[i].present.cost : ''
      ]);
    }
    return rows;
  }
}
