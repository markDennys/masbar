import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {
  public showDrink= false;
  

  ngOnInit(): void {
      
  }

  showsDrink(){
    this.showDrink = true ;
  }
  ashowsDrink(){
    this.showDrink = false ;
  }
}
