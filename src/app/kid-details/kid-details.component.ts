import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Kid } from '../kid/kid';
import {PresentGiver} from './present-giver';
import {ChristmasPresentsService} from '../christmas-presents.service';

@Component({
  selector: 'app-kid-details',
  templateUrl: './kid-details.component.html',
  styleUrls: ['./kid-details.component.css']
})
export class KidDetailsComponent implements OnInit {
  mercadoPagoSelected: boolean;
  cashWireSelected: boolean;
  Kid: Kid;
  presentGiver: PresentGiver;
  submitButtonDisabled: boolean;

  constructor(private router: Router, private presentsService: ChristmasPresentsService) {
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
                                this.presentGiver.contantEmail.trim().length == 0 ||
                                this.presentGiver.contactPhone.trim().length == 0 ||
                                this.presentGiver.letter.trim().length == 0) ||
                                (!this.mercadoPagoSelected && !this.cashWireSelected);
  }

  submitForm() {
    if (this.mercadoPagoSelected) {
      this.presentGiver.paymentMethod = 'MERCADOPAGO';
    } else if (this.cashWireSelected) {
      this.presentGiver.paymentMethod = 'EFECTIVO_TRANSFERENCIA';
    } else {
      this.presentGiver.paymentMethod = 'REVIEW';
    }
    this.presentsService.submitGiver(this.Kid.kidId, this.presentGiver).subscribe((response: any) => {
      console.log(response);
    });
  }
}
