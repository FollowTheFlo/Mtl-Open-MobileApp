import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../material.module';
import { SelectionListPageRoutingModule } from './selection-list-routing.module';

import { SelectionListPage } from './selection-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectionListPageRoutingModule,
    MaterialModule
  ],
  declarations: [SelectionListPage]
})
export class SelectionListPageModule {}
