import {Present} from './present';

export class Kid {
  public kidId: number = 0;
  public name: string = '';
  public age: string = '';
  public area: string = '';
  public note: string = '';
  public pictureUrl: string = '';
  public present: Present = new Present();
}
