import { Player } from '../models/player.model';
import { Tournament } from '../models/tournament.model';
import { Invoice } from '../models/invoice.model';

export interface Registration {
  _id: string;
  player: Player;
  tournament: Tournament;
  price: number;
  createdAt: string;
  hasPayed: boolean;
  paymentType: string;
  canceled: boolean;
  invoice: Invoice;
}
