import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { Facebook } from '@ionic-native/facebook/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from 'ngx-stripe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe/ngx';
//import { NavigationFooterComponent } from './shared-components/navigation-footer/navigation-footer.component';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GraphQLModule, 
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    NgxStripeModule.forRoot('pk_test_YcpYu1bpUhiX3j4NS4OdpngK00zA3zscJ3'),
    FormsModule,
    ReactiveFormsModule    
    
  ],
    
  providers: [StatusBar, SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
    Stripe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
