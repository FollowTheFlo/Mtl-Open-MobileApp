import { Tournament } from '../models/tournament.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { PopupTournamentPage } from '../shared-components/popup-tournament/popup-tournament.page';
import { PopupChartsPage } from '../shared-components/popup-charts/popup-charts.page';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

interface ChartData {
  labels: string[];
  seatsTaken: number[];
  seatsAvailable: number[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('tourChart', { static: false }) barChart;
  isLoading = true;
  isAuth = false;
  //tournaments: Tournament[];
  playerTournamentsDay1: Tournament[];
  playerTournamentsDay2: Tournament[];
  bars: any;
  colorArray: any;
  chartData: ChartData = {
    labels: [],
    seatsTaken: [],
    seatsAvailable: [],
  };

  constructor(
    public tournamentsService: TournamentsService,
    private navigationService: NavigationService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.tournamentsService.getTournaments().subscribe((tournaments) => {
      this.isLoading = false;
      // this.tournaments = tournaments;

      tournaments.map((tournament) => {
        this.chartData.labels.push('#' + tournament.index);
        this.chartData.seatsTaken.push(tournament.registrationsCount);
        this.chartData.seatsAvailable.push(tournament.maxPlayers - tournament.registrationsCount);
      });

      this.playerTournamentsDay1 = tournaments.filter((tournament) => tournament.day === 1);
      console.log('playerTournamentsDay1', this.playerTournamentsDay1);

      this.playerTournamentsDay2 = tournaments.filter((tournament) => tournament.day === 2);
      console.log('playerTournamentsDay2', this.playerTournamentsDay2);
    });
  }

  ionViewDidEnter() {
    this.navigationService.setNavLink('HOME');
    //this.createBarChart();
  }

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

  slideChanged() {
    console.log('slidechanged()');
    this.createBarChart();
  }

  createBarChart() {
    console.log('chartData ', this.chartData);
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: 'Seats available',
            data: this.chartData.seatsAvailable,
            backgroundColor: '#ddee44', // array should have same number of elements as number of dataset
            borderColor: '#ddee44', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: 'Seats taken',
            data: this.chartData.seatsTaken,
            backgroundColor: '#dd1144', // array should have same number of elements as number of dataset
            borderColor: '#dd1144', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }],
        },
      },
    });
  }
}
