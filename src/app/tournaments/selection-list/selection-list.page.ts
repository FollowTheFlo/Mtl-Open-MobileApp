import { Tournament } from '../../models/tournament.model';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TournamentsService } from '../tournaments.service';
import { PlayersService } from '../../players/players.service';
import { RegistrationsService } from '../../registrations/registrations.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { take, filter, map } from 'rxjs/operators';
import { TournamentSelection } from './../../models/tournamentSelection.model';
import { Subscription } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavigationService } from '../../navigation.service';
import { Player } from '@/app/models/player.model';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.page.html',
  styleUrls: ['./selection-list.page.scss'],
})
export class SelectionListPage implements OnInit, OnDestroy {
  private regSub: Subscription;
  private routeSub: Subscription;
  errorMessage = '';
  day1Number = 0;
  day2Number = 0;
  tournamentChecked = false;
  tournaments: Tournament[];
  selectedTournaments: TournamentSelection[] = [];
  playerTournaments: any = [];
  playerTournamentsDay1: any = [];
  playerTournamentsDay2: any = [];
  playerId: string;
  player: Player;
  constructor(
    public tournamentsService: TournamentsService,
    public route: ActivatedRoute,
    public registrationsService: RegistrationsService,
    private alertCtrl: AlertController,
    private navigationService: NavigationService,
    private playersService: PlayersService,
  ) {}

  ngOnInit() {
    //get registration from server in case there were not generated from Registration tab

    this.routeSub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log('param', paramMap);
      this.regSub = this.registrationsService.getRegistrations().subscribe();
      this.registrationsService.fillSelectionsWithRegistrations();

      if (paramMap.has('playerId')) {
        this.playerId = paramMap.get('playerId');

        this.player = this.playersService.getOnePlayer(this.playerId);
        console.log('selection-list player', this.player);

        if (this.player) {
          this.navigationService.setNavLink(this.player.firstName + ' ' + this.player.lastName);
        } else {
          this.navigationService.setNavLink('TOUR_SEL');
        }

        // get selected tournament for this specific player
        this.selectedTournaments = this.registrationsService.selectedTournaments.filter(
          (element) => element.playerId === this.playerId,
        );
        this.day1Number = this.selectedTournaments.filter((element) => {
          console.log('element.day: ', element.day);
          return element.day === 1;
        }).length;
        this.day2Number = this.selectedTournaments.filter((element) => element.day === 2).length;
        console.log('day1Number: ', this.day1Number);
        console.log('day2Number: ', this.day2Number);
        // full list of tournaments
        this.tournamentsService.getTournaments().subscribe((tournaments) => {
          this.playerTournaments = [];

          // looping through all tournaments,
          tournaments.forEach((tournament) => {
            // check if this tournament was already selected
            const t = this.selectedTournaments.find(
              (selection) => tournament._id.toString() === selection.tournamentId.toString(),
            );
            if (t !== undefined) {
              // match, tournament was already selecetd, thus setting isSelecetd to true
              this.playerTournaments.push({
                ...tournament,
                isSelected: true,
                isLocal: t.isLocal,
              });
            } else {
              this.playerTournaments.push({
                ...tournament,
                isSelected: false,
                isLocal: true,
              });
            }
          });

          this.playerTournamentsDay1 = this.playerTournaments.filter((tournament) => tournament.day === 1);
          console.log('playerTournamentsDay1', this.playerTournamentsDay1);

          this.playerTournamentsDay2 = this.playerTournaments.filter((tournament) => tournament.day === 2);
          console.log('playerTournamentsDay2', this.playerTournamentsDay2);
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.regSub) {
      this.regSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  onToggleClick(e: any, tournamentId: string, tournamentDay: number, isChecked: boolean) {
    console.log('Toggle event: ', e);
    //  console.log('checkbox1', e.checked);
    //  e.checked = false;
    //  console.log('checkbox2', e.checked);
    if (isChecked && this.registrationsService.isTournamentMaxPlayersReached(tournamentId)) {
      console.log('in max registration condition');

      e.checked = !e.checked;
      console.log('Error', 'Selection not possible', 'This category has reached maximum registrations');
      this.showAlert('Selection not possible', 'This category has reached maximum registrations');
      return;
    }
    if (this.checkDayMax(tournamentDay, isChecked)) {
      //console.log()

      this.registrationsService.addRemoveSelectedTournament(this.playerId, tournamentId, tournamentDay, isChecked);
    } else {
      console.log('max reached');
      console.log('Already 3 registration on Day ' + tournamentDay);
      e.checked = !e.checked;
      this.showAlert('Selection not possible', `Already 3 registrations on day ${tournamentDay}`);
      //console.log('Error', 'Selection not possible', `Already 3 registrations on day ${tournamentDay}`);
    }
  }

  checkDayMax(tournamentDay, isChecked) {
    console.log('in checkDayMax, day1Number :', this.day1Number);
    console.log('in checkDayMax, day2Number :', this.day2Number);

    if (tournamentDay === 1) {
      if (isChecked) {
        this.day1Number++;
      } else {
        this.day1Number--;
      }

      if (this.day1Number > 3) {
        console.log('checkDayMax1 reached');
        this.day1Number--;
        return false;
      }
    }
    if (tournamentDay === 2) {
      if (isChecked) {
        this.day2Number++;
      } else {
        this.day2Number--;
      }
      if (this.day2Number > 3) {
        console.log('checkDayMax2 reached');
        this.day2Number--;
        return false;
      }
    }

    return true;
  }
  private showAlert(head: string, message: string) {
    this.alertCtrl.create({ header: head, message: message, buttons: ['okay'] }).then((alertEl) => alertEl.present());
  }
}
