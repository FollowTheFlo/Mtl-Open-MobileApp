import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TournamentsService } from '../../tournaments/tournaments.service';
import { Tournament } from '../../models/tournament.model';
import { NavParams, ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

interface ChartData {
  seatsTaken: number[];
  seatsAvailable: number[];
}

@Component({
  selector: 'app-popup-tournament',
  templateUrl: './popup-tournament.page.html',
  styleUrls: ['./popup-tournament.page.scss'],
})
export class PopupTournamentPage implements OnInit {
  @Input() tournamentId: string;
  tournament: Tournament;
  bars: any;
  colorArray: any;
  chartData: ChartData = {
    seatsTaken: [],
    seatsAvailable: [],
  };

  constructor(
    private tournamentsService: TournamentsService,
    private navParams: NavParams,
    private ModalCtrl: ModalController,
  ) {
    this.tournamentId = navParams.get('tournamentId');
  }

  ngOnInit() {
    this.tournament = this.tournamentsService.getOneTournament(this.tournamentId);
    console.log('init reg count', this.tournament.registrationsCount);
  }

  closeModal() {
    this.ModalCtrl.dismiss();
  }
}
