import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BeerModule } from '../beer/beer-module';
import { CallModule } from '../call/call-module';
import { ShopModule } from '../shop/shop-module';
import { HomeComponent } from './home-component';
 

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BeerModule,
    ShopModule,
    CallModule
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
