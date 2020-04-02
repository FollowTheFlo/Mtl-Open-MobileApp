import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
    NgxStripeModule.forRoot('pk_test_YcpYu1bpUhiX3j4NS4OdpngK00zA3zscJ3'),
  ]
})
export class StripeModule { }
