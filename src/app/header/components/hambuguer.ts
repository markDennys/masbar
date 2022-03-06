import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'menu-hamburguer',
  templateUrl: './hamburguer.html',
  styleUrls: ['./hamburguer.css'],
})
export class HamburguerComponent implements OnInit {
  @Output() toogleNav = new EventEmitter();
  public changeToX= false;

  constructor() {}

  ngOnInit(): void {}

  clickBurgur() {
   this.changeToX = !this.changeToX;
   this.toogleNav.emit(this.changeToX);
  }
}
