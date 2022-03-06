import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FooterModule } from '../footer/footer-module';
import { CallComponent } from './call-component';
 

@NgModule({
  declarations: [
    CallComponent
  ],
  imports: [
    BrowserModule,
    FooterModule
    
  ],
  exports:[
    CallComponent
  ]
})
export class CallModule { }
