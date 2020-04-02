import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material';


import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatDialogModule,
  MatTabsModule,
  MatGridListModule,
  MatButtonToggleModule
} from "@angular/material";
 
@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonToggleModule
  ]
})
export class MaterialModule {}
