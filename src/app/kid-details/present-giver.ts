import {Present} from '../kid/present';

export class PresentGiver {
  public presentGiverId: number = 0;
  public name: string = '';
  public contactPhone: string = '';
  public contactEmail: string = '';
  public letter: string = '';
  public paymentMethod: string = '';
  public present: Present = new Present();
}
