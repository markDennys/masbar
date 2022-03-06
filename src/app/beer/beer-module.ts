import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BeerComponent } from './beer-component';
 

@NgModule({
  declarations: [
    BeerComponent
  ],
  imports: [
    BrowserModule,
    
  ],
  exports:[
    BeerComponent
  ]
})
export class BeerModule { }
