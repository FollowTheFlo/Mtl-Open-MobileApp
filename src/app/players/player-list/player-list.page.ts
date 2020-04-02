import { Player } from '../../models/player.model';

import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewChecked } from '@angular/core';
import { PlayersService } from '../players.service';
import { RegistrationsService } from '../../registrations/registrations.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService} from '../../navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
})
export class PlayerListPage implements OnInit, OnDestroy {
  private playersSub: Subscription;
  private regSub: Subscription;

  isLoading = true;
  players: Player[] = [];
  constructor(
    public playersService: PlayersService,
    public route: ActivatedRoute,
    private router: Router,
    public registrationsService: RegistrationsService,
    private navigationService: NavigationService
  ) {}

  ionViewDidEnter() {
    this.navigationService.setNavLink('Players List');
  }

  ngOnInit() {
    console.log('PlayerListPage1 ionViewWillEnter');
    this.playersSub = this.playersService.getPlayers().subscribe((players) => {
      if (players.length === 0) {
        //redirect to CreatePlayer if no player
        this.router.navigate(['create']);
      }
      this.players = players;
      this.isLoading = false;
    });

    this.regSub = this.registrationsService
      .getRegistrations()
      .subscribe((reg) => console.log('getRegistrations obs has run'));
  }

  // ionViewWillEnter() {
    
  //   console.log('PlayerListPage1 ionViewWillEnter');
  //   this.playersSub = this.playersService.getPlayers().subscribe((players) => {
  //     if (players.length === 0) {
  //       //redirect to CreatePlayer if no player
  //       this.router.navigate(['create']);
  //     }
  //     this.players = players;
  //     this.isLoading = false;
  //   });

  //   this.regSub = this.registrationsService
  //     .getRegistrations()
  //     .subscribe((reg) => console.log('getRegistrations obs has run'));
  // }

  // ionViewDidLeave() { 
  //   console.log('PlayerListComponent, ionViewDidLeave');
  //   if (this.playersSub) {
  //     this.playersSub.unsubscribe();
  //   }
  //   if (this.regSub) {
  //     this.regSub.unsubscribe();
  //   }
  // }
  
  ngOnDestroy() {
    console.log('PlayerListComponent, OnDestroy');
    if (this.playersSub) {
      this.playersSub.unsubscribe();
    }
    if (this.regSub) {
      this.regSub.unsubscribe();
    }
  }

  onCreatePlayer() {
    console.log('onCreatePlayer');
    this.router.navigate(['/player-create']);
  }
}
