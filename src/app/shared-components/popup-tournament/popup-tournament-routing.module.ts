import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupTournamentPage } from './popup-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: PopupTournamentPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupTournamentPageRoutingModule {}
