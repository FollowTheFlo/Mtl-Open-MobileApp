import { Component, OnInit, ViewChild } from '@angular/core';
import { Tournament } from '../../models/tournament.model';
import { AuthService } from '../../auth/auth.service';
import { TournamentsService } from '../../tournaments/tournaments.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation.service';
import { PopupTournamentPage } from '../../shared-components/popup-tournament/popup-tournament.page';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

interface ChartData {
  labels: string[];
  seatsTaken: number[];
  seatsAvailable: number[];
}

@Component({
  selector: 'tournaments-chart',
  templateUrl: './popup-charts.page.html',
  styleUrls: ['./popup-charts.page.scss'],
})
export class PopupChartsPage implements OnInit {
  @ViewChild('tourChart', { static: false }) barChart;
  isLoading = true;
  isAuth = false;
  tournaments: Tournament[];
  bars: any;
  colorArray: any;
  chartData: ChartData = {
    labels: [],
    seatsTaken: [],
    seatsAvailable: [],
  };

  constructor(public tournamentsService: TournamentsService) {}

  // ngAfterViewInit() {
  //   console.log('ngAfterViewInit');
  //   this.createBarChart();
  //   this.isLoading = false;
  // }

  ngOnInit() {
    this.isLoading = true;
    console.log('PopupChartsPage: OnInit');
    this.tournamentsService.getTournaments().subscribe((tournaments: Tournament[]) => {
      tournaments.map((tournament) => {
        this.chartData.labels.push('#' + tournament.index);
        this.chartData.seatsTaken.push(tournament.registrationsCount);
        this.chartData.seatsAvailable.push(tournament.maxPlayers - tournament.registrationsCount);
      });
      //console.log('createBarChart');
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter chartData ', this.chartData);
    this.createBarChart();
    this.isLoading = false;
    // this.createBarChart();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter chartData ', this.chartData);
    this.createBarChart();
    this.isLoading = false;
    // this.createBarChart();
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

  createBarChart1() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: 'Viewers in millions',
            data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
            backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}
