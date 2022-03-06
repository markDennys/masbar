import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShopComponent } from './shop-component';
 

@NgModule({
  declarations: [
    ShopComponent
  ],
  imports: [
    BrowserModule,
    
  ],
  exports:[
    ShopComponent
  ]
})
export class ShopModule { }
