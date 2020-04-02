import { Registration } from '../models/registration.model';
import { User } from '../models/user.model';

export interface Invoice {
  _id: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  hasPayed: boolean;
  paymentType: string;
  canceled: boolean;
  registrationsList: Registration[];
  creator: User;
}
