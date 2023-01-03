"use strict";
class Cubo {
    constructor(l, index, active = false) {
        this.l = l;
        this.index = index;
        this.elementoDOM = document.getElementsByClassName(`container-${this.index}`)[0].children[0];
        this.active = active;
    }
    area() {
        return Math.pow(this.l, 3);
    }
    adduma() {
        if (this.active == false) {
            console.log("false");
            this.elementoDOM.style["animation"] = "spin 5s infinite linear";
            this.active = true;
        }
        else {
            console.log("true");
            this.elementoDOM.style["animation"] = '';
            this.active = false;
        }
    }
}
let cubi = [];
for (let i = 0; i < 5; i++) {
    cubi[i] = new Cubo(1, i); //cubi[i] controlla il cubo i-esimo
    console.log(cubi[i].elementoDOM);
    cubi[i].elementoDOM.addEventListener("mousedown", function () {
        console.log("selezionato");
        cubi[i].adduma();
    });
}
//forme bidimensionali
let shapeIndex = 0; //serve ad individuare id delle figure create
let shapeArray = []; //contiene le figure create
class Rettangolo {
    constructor(l, h, v = [0, 0, 0]) {
        this.l = l;
        this.h = h;
        this.domE = this.creaNelDOM();
        this.v = v;
    }
    area() {
        return this.l * this.h;
    }
    creaNelDOM() {
        shapeIndex++;
        document.body.innerHTML += `<div id="Fig-${shapeIndex}" style="background-color: blue;  height: ${this.h * 100}px; width:${this.l * 100}px;"></div>`;
        return document.getElementById(`Fig-${shapeIndex}`);
    }
    traslaDx() {
        console.log(this.domE);
        this.v[0] += 100;
        this.domE.style.transform = `translateX(${this.v[0]}px)`;
    }
    traslaSx() {
        this.v[0] -= 30;
        this.domE.style.transform = `translateX(${this.v[0]}px)`;
    }
}
class Quadrato extends Rettangolo {
    constructor(l) {
        super(l, l);
    }
}
function calcolaArea(figura, tipo) {
    return figura.area();
}
