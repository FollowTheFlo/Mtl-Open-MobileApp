import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
    // StripeModule
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}
