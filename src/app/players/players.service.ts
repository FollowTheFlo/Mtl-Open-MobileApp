import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GraphqlService } from '../graphql/graphql.service';
import { AuthService } from '../auth/auth.service';
import { Subscription, BehaviorSubject, Observable, of, from } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Player } from '../models/player.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  // tslint:disable-next-line: variable-name
  private players: Player[] = [];
  private _players = new BehaviorSubject<Player[]>([]);

  constructor(private graphqlService: GraphqlService, private authService: AuthService) {}

  get player$() {
    return this._players.asObservable();
  }

  isPlayerListEmpty(): boolean {
    if (this.players === undefined || !this.players || this.players.length === 0) {
      return true;
    }
    return false;
  }

  getOnePlayer(playerId: string): Player {
    console.log(
      'flo player0 ',
      this.players.find((player) => player._id === playerId),
    );

    return this.players.find((player) => player._id === playerId);
  }

  addLocalPlayer(player: Player) {
    console.log('addLocalPlayer: ', player);
    this.players.push(player);
    console.log('addLocalPlayer: thisPlayer ', this.players);
    this._players.next([...this.players]);
  }

  fetchPlayers() {}

  createPlayer(firstName: string, lastName: string, email: string, ranking: number) {
    return this.graphqlService
      .createPlayer(firstName, lastName, email, ranking)
      .pipe(map((result) => result.data.createPlayer));
  }

  getPlayers() {
    return this.graphqlService.getplayers().pipe(
      map((result) => {
        if (result.errors && result.errors[0]) {
          console.log('login error data: ', result.errors[0].message);
          throw new Error(result.errors[0].message);
        }
        return result.data.getUserPlayers.players;
      }),
      map((resData) => {
        console.log('getplayers Flooooooo: ', resData);
        const players = [];
        resData.forEach((el) => {
          //el.dob = new Date(+el.dob).toLocaleDateString();
          players.push(el);
        });
        return players;
      }),
      tap((players) => {
        console.log('getplayers in Tap Flooooooo: ', players);
        this._players.next(players);
        this.players = players;
      }),
    );
  }
}
