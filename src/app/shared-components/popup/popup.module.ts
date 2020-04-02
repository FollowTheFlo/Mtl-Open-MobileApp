import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { AppModule } from './app.module';

 import { PopupComponent } from './popup.component';
 import { IonicModule } from '@ionic/angular';
// import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule,
    IonicModule,
   // AppRoutingModule
   
  ],
  entryComponents: [  ],
  exports: [
    PopupComponent,

  ],
})
export class PopupModule { }
