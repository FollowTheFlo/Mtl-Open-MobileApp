import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerCreatePage } from './player-create.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerCreatePageRoutingModule {}
