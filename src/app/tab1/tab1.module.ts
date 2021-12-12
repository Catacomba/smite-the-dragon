import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabPractice } from './tab1.page';

import { TabPracticeRoutingModule } from './tab1-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabPracticeRoutingModule,
    FlexLayoutModule
  ],
  declarations: [TabPractice]
})
export class TabPracticeModule {}
