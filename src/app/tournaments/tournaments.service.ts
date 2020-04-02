import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphqlService } from '../graphql/graphql.service';
import { Subscription, BehaviorSubject, Observable, of, from } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Tournament } from '../models/tournament.model';

@Injectable({
  providedIn: 'root',
})
export class TournamentsService {
  private tournaments: Tournament[] = [];
  private _tournaments = new BehaviorSubject<Tournament[]>([]);

  constructor(private http: HttpClient, private graphqlService: GraphqlService) {}

  get tournaments$() {
    return this._tournaments.asObservable();
  }

  getOneTournament(tournamentId: string): Tournament {
    return this.tournaments.find((t) => t._id.toString() === tournamentId.toString());
  }

  getTournaments() {
    return this.graphqlService.getTournaments().pipe(
      map((result) => result.data.getTournaments.tournaments),
      map((resData) => {
        const tournaments = [];
        resData.forEach((el) => {
          tournaments.push(el);
        });
        return tournaments;
      }),
      tap((tournaments) => {
        this._tournaments.next(tournaments);
        this.tournaments = tournaments;
      }),
    );
  }
}
