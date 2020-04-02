import { Component, OnInit, Input } from '@angular/core';
import { TournamentsService } from '../../tournaments/tournaments.service';
import { Tournament } from '../../models/tournament.model';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-popup-tournament',
  templateUrl: './popup-tournament.page.html',
  styleUrls: ['./popup-tournament.page.scss'],
})
export class PopupTournamentPage implements OnInit {
  @Input() tournamentId: string;
  tournament: Tournament;

  constructor(
    private tournamentsService: TournamentsService,
    private navParams: NavParams,
    private ModalCtrl: ModalController,
  ) {
    this.tournamentId = navParams.get('tournamentId');
  }

  ngOnInit() {
    this.tournament = this.tournamentsService.getOneTournament(this.tournamentId);
  }

  closeModal() {
    this.ModalCtrl.dismiss();
  }
}
