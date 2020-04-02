import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminRegistrationListPageRoutingModule } from './admin-registration-list-routing.module';

import { AdminRegistrationListPage } from './admin-registration-list.page';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRegistrationListPageRoutingModule,
    MaterialModule
  ],
  declarations: [AdminRegistrationListPage]
})
export class AdminRegistrationListPageModule {}
