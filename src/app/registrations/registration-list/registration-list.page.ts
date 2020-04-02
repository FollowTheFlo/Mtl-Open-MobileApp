import { Registration } from '../../models/registration.model';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrationsService } from '../registrations.service';
import { Subscription } from "rxjs";
import { NavigationService} from '../../navigation.service';


@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.page.html',
  styleUrls: ['./registration-list.page.scss'],
})
export class RegistrationListPage implements OnInit, OnDestroy {
  isRegLoading = false;
  isSelLoading = false;
  registrations: Registration[] = [];
  selectedTournaments = [];
  totalPrice = 0;
  private registrationsSub: Subscription;
  private tournamentsSub: Subscription;

  constructor(public registrationsService: RegistrationsService, private navigationService: NavigationService) { }

  ngOnDestroy() {
    if (this.registrationsSub) {
      this.registrationsSub.unsubscribe();
    }
    if (this.tournamentsSub) {
      this.tournamentsSub.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.navigationService.setNavLink('Cart');
  }

  ngOnInit() {
    console.log('RegistrationListPage: ngOnInit');
    this.isRegLoading = true;
    this.isSelLoading = true;
    this.registrationsSub = this.registrationsService.getRegistrations()
    .subscribe(registrations => {
      this.isRegLoading = false;
      //console.log('registrations',registrations);
      this.registrations = registrations; });

    this.tournamentsSub = this.registrationsService.selectedTournaments$.
    subscribe(selections => {
      console.log('in getTempRegistrations', selections);
      this.isSelLoading = false;
      this.selectedTournaments = this.registrationsService.getTempRegistrations();


      console.log('in getTempRegistrations2', this.selectedTournaments);
      })

  }


}

