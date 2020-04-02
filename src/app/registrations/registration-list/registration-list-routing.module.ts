import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationListPage } from './registration-list.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationListPageRoutingModule {}
