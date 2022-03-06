import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HamburguerModule } from './components/hamburguer';
import { HeaderComponent } from './header-component';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HamburguerModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
