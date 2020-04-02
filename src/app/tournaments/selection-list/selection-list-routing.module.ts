import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectionListPage } from './selection-list.page';

const routes: Routes = [
  {
    path: '',
    component: SelectionListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectionListPageRoutingModule {}
