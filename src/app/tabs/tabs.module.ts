import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { PopupModule } from './../shared-components/popup/popup.module';
import { TranslationModule } from '../translation.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TabsPageRoutingModule, PopupModule, TranslationModule],
  declarations: [TabsPage],
})
export class TabsPageModule {}
