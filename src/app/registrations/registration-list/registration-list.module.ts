import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../material.module';

import { RegistrationListPageRoutingModule } from './registration-list-routing.module';

import { RegistrationListPage } from './registration-list.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RegistrationListPageRoutingModule, MaterialModule],
  declarations: [RegistrationListPage],
})
export class RegistrationListPageModule {}
