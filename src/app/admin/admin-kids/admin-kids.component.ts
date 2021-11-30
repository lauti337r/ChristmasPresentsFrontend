import {Component, OnInit, PipeTransform} from '@angular/core';
import {ChristmasPresentsService} from '../../christmas-presents.service';
import {Kid} from '../../kid/kid';
import {FormControl} from '@angular/forms';
import {map, Observable, pipe, startWith} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-admin-kids',
  templateUrl: './admin-kids.component.html',
  styleUrls: ['./admin-kids.component.css']
})
export class AdminKidsComponent implements OnInit {
  closeResult = '';
  private Kids: Kid[];
  SelectedKid: Kid;
  TableKids$: Observable<Kid[]>;
  filter = new FormControl('');

  constructor(private presentsService: ChristmasPresentsService,
              public pipe: DecimalPipe,
              private modalService: NgbModal) {
    this.Kids = [];
    this.TableKids$ = new Observable<Kid[]>();
    this.SelectedKid = new Kid();
  }

  ngOnInit(): void {
    this.presentsService.getKidsList().subscribe((response: Kid[]) => {
      this.Kids = response;

      this.TableKids$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
    });
  }

  search(text: string, pipe: PipeTransform): Kid[] {
    return this.Kids.filter(kid => {
      const term = text.toLowerCase();
      return kid.name.toLowerCase().includes(term) ||
        kid.area.toLowerCase().includes(term) ||
        kid.present.name.toLowerCase().includes(term) ||
        kid.age.toString().toLowerCase().includes(term);
    });
  }

  editKid(content: any, selectedKid: Kid) {
    this.SelectedKid = selectedKid;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.presentsService.updateKid(this.SelectedKid).subscribe((response: any) => {
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
}
