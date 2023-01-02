"use strict";
//forme bidimensionali
let shapeIndex = 0; //serve ad individuare id delle figure create
let shapeArray = []; //contiene le figure create
//I due elementi fondamentali
class ShapeSlave {
    constructor(shape) {
        this.shape = shape;
        this.domE = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        this.transformed = [0, 0, 0, 0, 0, 0];
    }
    calcolaArea() {
        switch (this.shape.forma) {
            case 'cerchio': return Math.pow(this.shape.measures[0], 2) * Math.PI;
            case 'rettangolo': return this.shape.measures[0] * this.shape.measures[1];
            case 'cubo': return Math.pow(this.shape.measures[0], 3);
            default: return -1;
        }
    }
    applyTransformation() {
        this.domE.style.transform = `
        translate3d(${this.transformed[0]}px, ${this.transformed[1]}px, ${this.transformed[2]}px)
        rotateX(${this.transformed[3]}deg)
        rotateY(${this.transformed[4]}deg)
        rotateZ(${this.transformed[5]}deg)`;
    }
    traslaDX() {
        this.transformed[0] += 100;
        this.applyTransformation();
        console.log(this.shape.domE);
    }
    traslaSX() {
        this.transformed[0] -= 100;
        this.applyTransformation();
    }
    traslaDN() {
        this.transformed[1] += 100;
        this.applyTransformation();
    }
    traslaUP() {
        this.transformed[1] -= 100;
        this.applyTransformation();
    }
    traslaNear() {
        this.transformed[2] += 300;
        this.applyTransformation();
    }
    traslaAway() {
        this.transformed[2] -= 300;
        this.applyTransformation();
    }
    ruotaXP() {
        this.transformed[3] += 45;
        this.applyTransformation();
    }
    ruotaXN() {
        this.transformed[3] -= 45;
        this.applyTransformation();
    }
    ruotaYP() {
        this.transformed[4] += 45;
        this.applyTransformation();
    }
    ruotaYN() {
        this.transformed[4] -= 45;
        this.applyTransformation();
    }
    ruotaZP() {
        this.transformed[5] += 45;
        this.applyTransformation();
    }
    ruotaZN() {
        this.transformed[5] -= 45;
        this.applyTransformation();
    }
}
;
function constructionString(forma, measures) {
    //ritorna la stringa da aggiungere al body per creare l'elemento
    //corrispondente ai parametri
    switch (forma) {
        case 'cerchio': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color:green; height:${measures[0] * 100}px; width:${measures[0] * 100}px; border-radius:50%"> </div>`;
        case 'rettangolo': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color: grey;  height: ${measures[0] * 100}px; width:${measures[1] * 100}px;"></div>`;
        case 'cubo': return ''; //ATTENZIONE!! Inserire cubo
        default: return 'forma non trovata';
    }
}
class Cerchio {
    constructor(raggio) {
        this.forma = 'cerchio';
        this.measures = [raggio];
        this.shapeIndex = shapeIndex;
        this.domE = this.creaNelDOM();
        shapeIndex += 1;
    }
    creaNelDOM() {
        document.getElementById('shapes').innerHTML += constructionString(this.forma, this.measures);
        return document.getElementById(`Fig-${shapeIndex}`);
    }
}
class Rettangolo {
    constructor(base, altezza) {
        this.forma = 'rettangolo';
        this.measures = [base, altezza];
        this.shapeIndex = shapeIndex;
        this.domE = this.creaNelDOM();
        shapeIndex += 1;
    }
    creaNelDOM() {
        document.getElementById('shapes').innerHTML += constructionString(this.forma, this.measures);
        return document.getElementById(`Fig-${shapeIndex}`);
    }
}
class Quadrato extends Rettangolo {
    constructor(lato) {
        super(lato, lato);
    }
}
//area sperimentazione - 1
let cerchio = new Cerchio(1);
let rettangolo = new Rettangolo(1, 3);
let quadrato = new Quadrato(1);
let slaveCerchio = new ShapeSlave(cerchio);
let slaveQuadrato = new ShapeSlave(quadrato);
slaveCerchio.traslaAway();
slaveCerchio.traslaDX();
slaveQuadrato.ruotaXP();
