import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerCreatePageRoutingModule } from './player-create-routing.module';

import { PlayerCreatePage } from './player-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerCreatePageRoutingModule
  ],
  declarations: [PlayerCreatePage]
})
export class PlayerCreatePageModule {}
