import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Player } from './../models/player.model';


import { PlayersService } from '.././players/players.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { AuthService } from '../auth/auth.service';
import { GraphqlService } from '../graphql/graphql.service';
import gql from 'graphql-tag';
import { Subscription, BehaviorSubject, Observable, of, from, EMPTY } from 'rxjs';
import { take, map, tap, delay, switchMap, concatMap, catchError, onErrorResumeNext, mergeMap } from 'rxjs/operators';
import { Registration } from '../models/registration.model';
import { Invoice } from '../models/invoice.model';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public allRegistrations: Registration[] = [];
  private _allRegistrations = new BehaviorSubject<Registration[]>([]);


  constructor(private graphqlService: GraphqlService,
              private playersService: PlayersService,
              private tournamentsService: TournamentsService,
              private authService: AuthService
) { }

get registrations$() {
  return this._allRegistrations.asObservable();
}

setAllRegistrations(registrations: Registration[]) {
  this.allRegistrations = registrations;
  this._allRegistrations.next(registrations);
}

getAllRegistrationList() {
  return this.graphqlService.getAllRegistrations()
  .pipe(
    map(result => result.data.adminGetTournamentRegistrations.registrations),
    map(resData => {
      console.log('flo0', resData);

      return resData;
      })
    );
}

confirmPayment(regId: string) {
  return this.graphqlService.confirmPayment(regId)
  .pipe(
    map(result => result.data.confirmPayment),
    map(resData => {
      console.log('flo confirmPayment', resData);

      return resData;
      })
    );
}

confirmInvoicePayment(invoiceId: string) {
  return this.graphqlService.confirmInvoicePayment(invoiceId)
  .pipe(
    map(result => result.data.confirmInvoicePayment),
    map(resData => {
      console.log('confirmInvoicePayment', resData);

      return resData;
      })
    );
}

cancelRegistration(regId: string) {
  return this.graphqlService.cancelRegistration(regId)
  .pipe(
    map(result => result.data.cancelRegistration),
    map(resData => {
      console.log('flo cancelRegistration', resData);

      return resData;
      })
    );
}

cancelInvoice(invId: string) {
  return this.graphqlService.cancelInvoice(invId)
  .pipe(
    map(result => result.data.cancelInvoice),
    map(resData => {
      console.log('flo cancelInvoice', resData);

      return resData;
      })
    );
}

getHistory(entity: string, entityId: string) {
  return this.graphqlService.getHistory(entity, entityId)
  .pipe(
    map(result => result.data.getHistory.historys),
    map(historyList => {
      return historyList.map(item => `${item.createdAt} - ${item.action} - ${item.user.email}`);

      })
    );
}

getAllInvoices() {
  //const registration$ = from(this.allRegistrations)
  return this.graphqlService.getAllInvoices().pipe(
        map(result => result.data.getAllInvoices.invoices),
        map(invoicesList => {
          return invoicesList.map(invoice => {
              console.log('registrationsList: ', this.allRegistrations);
              console.log('invoiceFlo',invoice);
              const InvoiceRegs = this.allRegistrations.filter(reg => reg.invoice._id === invoice._id );
              console.log('InvoiceRegs: ',InvoiceRegs);
              return {
              ...invoice,
              registrationsList: InvoiceRegs
            };
          });
        })
  )
}



}

