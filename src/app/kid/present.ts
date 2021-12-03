import {Kid} from './kid';
import {PresentGiver} from '../kid-details/present-giver';

export class Present {
  presentId: number = 0;
  name: string = '';
  cost: number = 0;
  shopName: string = '';
  presentGiverId: number = 0;

  // @ts-ignore
  kid: Kid = null;
  // @ts-ignore
  presentGiver: PresentGiver = null;
}
