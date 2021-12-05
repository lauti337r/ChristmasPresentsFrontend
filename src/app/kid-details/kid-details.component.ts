import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import { Kid } from '../kid/kid';
import {PresentGiver} from './present-giver';
import {ChristmasPresentsService} from '../christmas-presents.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Error315Component} from '../shared/error315/error315.component';

@Component({
  selector: 'app-kid-details',
  templateUrl: './kid-details.component.html',
  styleUrls: ['./kid-details.component.css']
})
export class KidDetailsComponent implements OnInit {
  @ViewChildren(Error315Component) error315Modal: Error315Component = new Error315Component();
  mercadoPagoSelected: boolean;
  cashWireSelected: boolean;
  Kid: Kid;
  presentGiver: PresentGiver;
  submitButtonDisabled: boolean;
  closeResult = '';

  constructor(private modalService: NgbModal,
              private router: Router,
              private presentsService: ChristmasPresentsService,
              private spinner: NgxSpinnerService) {
    this.presentGiver = new PresentGiver();
    this.mercadoPagoSelected = false;
    this.cashWireSelected = false;
    this.submitButtonDisabled = true;
    let kidDetails = localStorage.getItem('selectedKid');
    console.log(kidDetails);
    if (kidDetails != null) {
      this.Kid = JSON.parse(kidDetails);
    } else {
      this.Kid = new Kid();
      this.router.navigate(['/chicos']);
    }
  }

  optionSelected(option: number) {
    switch(option) {
      case 1: // Mercado Page
        this.mercadoPagoSelected = true;
        this.cashWireSelected = false;
        break;
      case 2: // Efectivo o transferencia bancaria
        this.mercadoPagoSelected = false;
        this.cashWireSelected = true;
        break;
    }
    this.updateButtonEnabling();
  }


  ngOnInit(): void {
  }

  updateButtonEnabling() {
    this.submitButtonDisabled = (this.presentGiver.name.trim().length == 0 ||
                                this.presentGiver.contactEmail.trim().length == 0 ||
                                this.presentGiver.contactPhone.trim().length == 0 ||
                                this.presentGiver.letter.trim().length == 0) ||
                                (!this.mercadoPagoSelected && !this.cashWireSelected);
  }

  submitForm(content: any, error315Content: any) {
    if (this.mercadoPagoSelected) {
      this.presentGiver.paymentMethod = 'MERCADOPAGO';
    } else if (this.cashWireSelected) {
      this.presentGiver.paymentMethod = 'EFECTIVO_TRANSFERENCIA';
    } else {
      this.presentGiver.paymentMethod = 'REVIEW';
    }

    this.spinner.show('KidDetailsSpinner');
    this.presentsService.submitGiver(this.Kid.kidId, this.presentGiver).subscribe((response: any) => {
      this.spinner.hide('KidDetailsSpinner');
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.router.navigate(['chicos']);
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error) => {
      if (error.error.code == 415) {
        this.spinner.hide('KidDetailsSpinner');
        this.modalService.open(error315Content, {ariaLabelledBy: '315-modal-basic-title'}).result.then((res) => {
          this.router.navigate(['chicos']);
        });
      }
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
    this.router.navigate(['chicos']);
  }

}
