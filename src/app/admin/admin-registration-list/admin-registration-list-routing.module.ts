import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRegistrationListPage } from './admin-registration-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminRegistrationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRegistrationListPageRoutingModule {}
