import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  public showNav: boolean;

  ngOnInit(): void {
      
  }

  toogleNav(event: any){
    this.showNav = event;
  }
}
