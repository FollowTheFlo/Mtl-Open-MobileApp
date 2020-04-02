import { Tournament } from '../../models/tournament.model';
import { AuthService } from '../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TournamentsService } from '../tournaments.service';
import { Subscription } from 'rxjs';
import { NavigationService} from '../../navigation.service';

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
  constructor(
    public tournamentsService: TournamentsService,
    public authService: AuthService,
    private navigationService: NavigationService
    ) {}

    ionViewDidEnter() {
      this.navigationService.setNavLink('Tournaments');
    }

  ngOnInit() {
    this.navigationService.setNavLink('Tournaments');
    this.isAuth = this.authService.getIsAuth();

    this.authSub = this.tournamentsService.getTournaments().subscribe((tournaments) => {
      this.isLoading = false;
      this.tournaments = tournaments;
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
