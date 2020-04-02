import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopupTournamentPageRoutingModule } from './popup-tournament-routing.module';

import { PopupTournamentPage } from './popup-tournament.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PopupTournamentPageRoutingModule],
  declarations: [PopupTournamentPage],
})
export class PopupTournamentPageModule {}
