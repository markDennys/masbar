import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop-component.html',
  styleUrls: ['./shop-component.css'],
})
export class ShopComponent implements OnInit {
  public slideNumber = 0;
  public showButtons = false;
  public qtd = 0;
  public total = 0;
  public mocksBeers = [
    {
      id: 1,
      name: 'Brahma chopp',
      price: 5.5,
      qtd: 0,
      image:
        'https://a-static.mlcdn.com.br/1500x1500/cerveja-brahma-lata-269ml/imigrantesbebidas/20009/77165917604893ef6dd4e695918081bb.jpg',
    },
    {
      id: 2,
      name: 'Heineken',
      price: 6.5,
      qtd: 0,
      image:
        'https://courier-images-prod.imgix.net/produc_variant/00009993_eab7024b-af50-4895-833f-66a092a1e0a4.jpg?auto=compress,format&fit=max&w=undefined&h=undefined&dpr=2?auto=compress,format&fit=max&w=undefined&h=undefined&dpr=2',
    },
    {
      id: 3,
      name: 'Skol',
      price: 5,
      qtd: 0,
      image:
        'https://a-static.mlcdn.com.br/1500x1500/cerveja-skol-pilsen-lata-350ml/imigrantesbebidas/132/4a9fbfb3af90ca15b79931a48aed86fd.jpg',
    },
    {
      id: 4,
      name: 'Budweiser',
      price: 7,
      qtd: 0,
      image:
        'https://emporiodacerveja.vtexassets.com/arquivos/ids/163414/imgBudLata_1000x1000px_01.jpg?v=636220559778470000',
    },
    {
      id: 5,
      name: 'Bohemia',
      price: 6,
      qtd: 0,
      image:
        'https://hiperideal.vteximg.com.br/arquivos/ids/196683-1000-1000/28612cd5edce8edc490c7293e91785cb_cerveja-bohemia-lata-269ml_lett_1.jpg?v=637780444385370000',
    },
  ];

  public lisShop = [];

  ngOnInit(): void {}

  sub() {
    this.slideNumber = this.slideNumber - 1;
    if (this.slideNumber < 0) {
      this.slideNumber = 4;
    }
    this.resetQtd();
  }

  add() {
    this.slideNumber = this.slideNumber + 1;
    if (this.slideNumber > 4) {
      this.slideNumber = 0;
    }
    this.resetQtd();
  }

  resetQtd() {
    this.qtd = this.mocksBeers[this.slideNumber].qtd;
  }

  subtqtd() {
    this.qtd -= 1;
    if (this.qtd <= 0) {
      this.qtd = 0;
    }
    this.mocksBeers[this.slideNumber].qtd = this.qtd;
  }
  addqtd() {
    this.qtd += 1;
    this.mocksBeers[this.slideNumber].qtd = this.qtd;
  }

  toShowButtons() {
    return this.mocksBeers.find((el) => el.qtd > 0) ? true : false;
  }

  getTotal() {
    let total = 0;
    this.mocksBeers.forEach((el) => {
      if (el.qtd > 0) {
        total += el.price * el.qtd;
      }
    });
    return total;
  }

  esvaziar(){
    this.qtd = 0
    this.mocksBeers.forEach(el => el.qtd = 0 )
  }
}
