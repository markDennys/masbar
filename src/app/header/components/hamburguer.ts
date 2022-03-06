import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HamburguerComponent } from './hambuguer';


@NgModule({
  declarations: [
    HamburguerComponent
  ],
  imports: [
    BrowserModule,
  ],
  exports:[
    HamburguerComponent
  ]
})
export class HamburguerModule { }
