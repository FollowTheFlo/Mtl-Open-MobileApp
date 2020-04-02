import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Player } from './../models/player.model';
import { Invoice } from './../models/invoice.model';

import { PlayersService } from '.././players/players.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { AuthService } from '../auth/auth.service';
import { GraphqlService } from '../graphql/graphql.service';
import gql from 'graphql-tag';
import { Subscription, BehaviorSubject, Observable, of, from, EMPTY } from 'rxjs';
import { take, map, tap, delay, switchMap, concatMap, catchError, onErrorResumeNext, mergeMap } from 'rxjs/operators';
import { Registration } from '../models/registration.model';
import { TournamentSelection } from '../models/tournamentSelection.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService {
  public skinnyRegistrations: Registration[] = [];
  public selectedTournaments: TournamentSelection[] = [];
  private registrations: Registration[] = [];
  private _selectedTournaments = new BehaviorSubject<TournamentSelection[]>([]);

  private _registrations = new BehaviorSubject<Registration[]>([]);

  constructor(
    private graphqlService: GraphqlService,
    private playersService: PlayersService,
    private tournamentsService: TournamentsService,
    private authService: AuthService,
  ) {}

  get registrations$() {
    return this._registrations.asObservable();
  }

  get selectedTournaments$() {
    return this._selectedTournaments.asObservable();
  }

  payWithCard(amount: number, token: string) {
    return this.graphqlService.payWithCard(amount, token);
  }

  isTournamentMaxPlayersReached(tournamentId) {
    console.log('isTournamentMaxPlayersReached', tournamentId);
    const tournament = this.tournamentsService.getOneTournament(tournamentId);

    const localTournamentSelection = this.selectedTournaments.filter((st) => {
      return st.tournamentId.toString() === tournamentId.toString();
    });

    console.log('localTournamentSelection', localTournamentSelection);

    if (localTournamentSelection.length + tournament.registrationsCount >= tournament.maxPlayers) {
      return true;
    }
    return false;
  }

  fillSelectionsWithRegistrations() {
    this.selectedTournaments = this.selectedTournaments.filter((t) => t.isLocal === true);
    console.log('fillSelectionsWithRegistrations');
    this.registrations.map((reg) => {
      this.selectedTournaments.push({
        day: reg.tournament.day,
        playerId: reg.player._id,
        tournamentId: reg.tournament._id.toString(),
        isLocal: false,
      });
    });
    console.log(this.selectedTournaments);
  }

  getTempRegistrations() {
    //invalid tem selection that have player null in some scenario, so cleaning them.
    //workaround for the mom, need to investigate more
    this.skinnyRegistrations = this.selectedTournaments
      .filter((selection) => selection.playerId !== null)
      .filter((selection) => selection.isLocal === true)
      .map((selection) => {
        //if(selection.isLocal === true) {
        const player = this.playersService.getOnePlayer(selection.playerId);
        const tournament = this.tournamentsService.getOneTournament(selection.tournamentId);
        const tempRegistration: Registration = {
          _id: null,
          invoice: null,
          player,
          tournament,
          price: tournament.price,
          hasPayed: false,
          paymentType: 'unknown',
          createdAt: null,
          canceled: false,
        };
        return tempRegistration;
      });

    console.log('this.skinnyRegistrations: ', this.skinnyRegistrations);
    return [...this.skinnyRegistrations];
  }

  getRegistrations() {
    return this.graphqlService.getRegistrations().pipe(
      map((result) => result.data.getUserRegistrations.registrations),
      map((resData) => {
        console.log('flo0', resData);
        this.registrations = resData;

        return resData;
      }),
      tap((resData) => this._registrations.next(resData)),
    );
  }

  createInvoiceAndRegistrations(hasPayed: boolean, paymentType: string, totalPrice: number) {
    console.log('createInvoiceAndRegistrations');
    // const skinnyRegs$ = from( this.skinnyRegistrations);

    return this.graphqlService.createInvoice(hasPayed, totalPrice, paymentType).pipe(
      map((resData) => resData.data.createInvoice._id),
      map((invoiceId) => {
        console.log('invoiceId: ', invoiceId);
        //adding the invoiceId to selected registrations
        return this.skinnyRegistrations.map((reg) => {
          return {
            ...reg,
            invoiceId,
          };
        });
      }),
      switchMap((regList) => from(regList)),
      concatMap((reg) => {
        return this.graphqlService.registerPlayer(
          reg.invoiceId,
          reg.player._id,
          reg.tournament._id,
          hasPayed,
          paymentType,
        );
      }),
      tap((res) => {
        this.skinnyRegistrations = [];
        this.selectedTournaments = [];
        this._selectedTournaments.next([]);
        this.graphqlService.resetStore().then((result) => {
          console.log('Apollo Store Cache reset:', result);
        });
        console.log('in Tap');
      }),
    );
  }

  createRegistrations(invoiceId: string, hasPayed: boolean, paymentType: string) {
    console.log('in createRegistrations');
    let resData: any;
    const skinnyRegs$ = from(this.skinnyRegistrations);

    return skinnyRegs$.pipe(
      concatMap((reg) => {
        return this.graphqlService.registerPlayer(invoiceId, reg.player._id, reg.tournament._id, hasPayed, paymentType);
      }),
      tap((res) => {
        this.skinnyRegistrations = [];
        this.selectedTournaments = [];
        this._selectedTournaments.next([]);
        this.graphqlService.resetStore().then((result) => {
          console.log('Apollo Store Cache reset:', result);
        });
        console.log('in Tap');
      }),
    );
  }

  addRemoveSelectedTournament(playerId: string, tournamentId: string, tournamentDay: number, toBeAdded: boolean) {
    const selectionIndex = this.selectedTournaments.findIndex(
      (element) => element.playerId === playerId && element.tournamentId === tournamentId,
    );
    console.log('index', selectionIndex);
    if (toBeAdded) {
      //we expect no item in list so 'undefined'
      if (selectionIndex < 0) {
        console.log('adding item', playerId, tournamentId);
        this.selectedTournaments.push({ playerId, tournamentId, isLocal: true, day: tournamentDay });
      } else {
        console.log('mismatch: adding the tournament altgough it was already in list');
      }
    } else {
      if (selectionIndex >= 0) {
        console.log('removing item');
        this.selectedTournaments.splice(selectionIndex, 1);
      } else {
        console.log('mismatch:removing the tournament altgough it was NOT in list');
      }
    }

    //notify there was a selection done
    console.log('addSelectedTournament: ', this.selectedTournaments);
    this._selectedTournaments.next(this.selectedTournaments);
  }

  getUserInvoices() {
    let registrationsList = [];

    return this.graphqlService.getRegistrations().pipe(
      map((result) => result.data.getUserRegistrations.registrations),
      map((regs) => (registrationsList = regs)),
      switchMap((regs) => this.graphqlService.getUserInvoices()),
      map((reponse) => reponse.data.getUserInvoices.invoices),
      map((invoicesList) => {
        return invoicesList.map((invoice) => {
          console.log('registrationsList: ', registrationsList);
          const InvoiceRegs = registrationsList.filter((reg) => reg.invoice._id === invoice._id);
          console.log('InvoiceRegs: ', InvoiceRegs);
          return {
            ...invoice,
            registrationsList: InvoiceRegs,
          };
        });
      }),
    );
  }
}
