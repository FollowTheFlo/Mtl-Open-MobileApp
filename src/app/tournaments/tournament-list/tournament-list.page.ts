import { Tournament } from '../../models/tournament.model';
import { AuthService } from '../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TournamentsService } from '../tournaments.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation.service';
import { PopupTournamentPage } from '../../shared-components/popup-tournament/popup-tournament.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.page.html',
  styleUrls: ['./tournament-list.page.scss'],
})
export class TournamentListPage implements OnInit, OnDestroy {
  private authSub: Subscription;
  isLoading = true;
  isAuth = false;
  tournaments: Tournament[];
  playerTournamentsDay1: Tournament[];
  playerTournamentsDay2: Tournament[];

  constructor(
    public tournamentsService: TournamentsService,
    public authService: AuthService,
    private navigationService: NavigationService,
    private modalCtrl: ModalController,
  ) {}

  async presentModal(tournamentId) {
    console.log('presentModal', tournamentId);
    const modal = await this.modalCtrl.create({
      component: PopupTournamentPage,
      componentProps: {
        tournamentId: tournamentId,
      },
    });
    modal.style.cssText = '--min-height: 120px; --max-height: 300px;';
    return await modal.present();
  }

  ionViewDidEnter() {
    this.navigationService.setNavLink('Tournaments');
  }

  ngOnInit() {
    this.navigationService.setNavLink('Tournaments');
    this.isAuth = this.authService.getIsAuth();

    this.authSub = this.tournamentsService.getTournaments().subscribe((tournaments) => {
      this.isLoading = false;
      this.tournaments = tournaments;

      this.playerTournamentsDay1 = tournaments.filter((tournament) => tournament.day === 1);
      console.log('playerTournamentsDay1', this.playerTournamentsDay1);

      this.playerTournamentsDay2 = tournaments.filter((tournament) => tournament.day === 2);
      console.log('playerTournamentsDay2', this.playerTournamentsDay2);
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
