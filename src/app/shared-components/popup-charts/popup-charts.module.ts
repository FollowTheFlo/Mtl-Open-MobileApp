import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PopupChartsPage } from './popup-charts.page';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [PopupChartsPage],
  exports: [PopupChartsPage],
})
export class PopupChartsPageModule {}
