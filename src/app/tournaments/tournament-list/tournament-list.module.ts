import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TournamentListPageRoutingModule } from './tournament-list-routing.module';

import { TournamentListPage } from './tournament-list.page';
import { PopupTournamentPageModule } from '../../shared-components//popup-tournament/popup-tournament.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TournamentListPageRoutingModule, PopupTournamentPageModule],
  declarations: [TournamentListPage],
})
export class TournamentListPageModule {}
