"use strict";
//forme bidimensionali
var _a;
let shapeIndex = 0; //serve ad individuare id delle figure create
let shapeArray = []; //contiene le figure create
//I due elementi fondamentali
class ShapeSlave {
    constructor(shape) {
        this.shape = shape;
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
    getDomElement() {
        let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        if (t != null) {
            return t;
        }
        else {
            console.log("elemento non trovato!");
            return document.body;
        }
    }
    getInfoBoundary() {
        let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        if (t != null) {
            let BQ = t.getBoundingClientRect();
            console.log("boundaries:");
            console.log(BQ.right, BQ.bottom, BQ.left, BQ.top);
            console.log("height, width:", BQ.height, BQ.width);
            return [BQ.right, BQ.bottom, BQ.left, BQ.top];
        }
        else {
            console.log("elemento del dom non trovato!");
            return [-1];
        }
    }
    applyTransformation() {
        let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        if (t != null) {
            t.style.transform = `
        translate3d(${this.transformed[0]}px, ${this.transformed[1]}px, ${this.transformed[2]}px)
        rotateX(${this.transformed[3]}deg)
        rotateY(${this.transformed[4]}deg)
        rotateZ(${this.transformed[5]}deg)`;
        }
        else {
            console.log("elemento del dom da trasformare non trovato!");
        }
    }
    position(x, y, z) {
        this.transformed[0] = x;
        this.transformed[1] = y;
        if (z != undefined) {
            this.transformed[2] = z;
        }
        this.applyTransformation();
    }
    traslaDX() {
        this.transformed[0] += 100;
        this.applyTransformation();
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
;
function constructionString(forma, measures, color = 'grey') {
    //ritorna la stringa da aggiungere al body per creare l'elemento
    //corrispondente ai parametri
    switch (forma) {
        case 'cerchio': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color:${color}; height:${measures[0] * 100}px; width:${measures[0] * 100}px; border-radius:50%"> ${shapeIndex} </div>`;
        case 'rettangolo': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color: ${color};  height: ${measures[0] * 100}px; width:${measures[1] * 100}px"> ${shapeIndex}</div>`;
        case 'cubo': return ''; //ATTENZIONE!! Inserire cubo
        default: return 'forma non trovata';
    }
}
;
class Cerchio {
    constructor(raggio, color) {
        this.forma = 'cerchio';
        this.measures = [raggio];
        this.shapeIndex = shapeIndex;
        this.creaNelDOM(color);
        shapeIndex += 1;
    }
    creaNelDOM(color) {
        let t = document.getElementById('shapes');
        if (t != null) {
            t.innerHTML += constructionString(this.forma, this.measures, color);
        }
        else {
            console.log("errore contenitore shapes non trovato");
        }
    }
}
;
class Rettangolo {
    constructor(base, altezza, color) {
        this.forma = 'rettangolo';
        this.measures = [base, altezza];
        this.shapeIndex = shapeIndex;
        this.creaNelDOM(color);
        shapeIndex += 1;
    }
    creaNelDOM(color) {
        let t = document.getElementById('shapes');
        if (t != null) {
            t.innerHTML += constructionString(this.forma, this.measures, color);
        }
        else {
            console.log("errore contenitore shapes non trovato");
        }
    }
}
;
class Quadrato extends Rettangolo {
    constructor(lato, color) {
        super(lato, lato, color);
    }
}
;
class Dio {
    creazione(s, measures, color) {
        switch (s) {
            case 'cerchio':
                let c = new Cerchio(measures[0], color);
                let s = new ShapeSlave(c);
                return { shape: c, slave: s };
            case 'rettangolo':
                let r = new Rettangolo(measures[0], measures[1], color);
                let t = new ShapeSlave(r);
                return { shape: r, slave: t };
            default:
                let blowup = new Rettangolo(100, 100);
                return { shape: blowup, slave: new ShapeSlave(blowup) };
        }
    }
}
class ConsulenzaDiCoppiaRettangoli {
    constructor(genitore1, genitore2) {
        this.genitore1 = genitore1;
        this.genitore2 = genitore2;
    }
    verifyIntersection() {
        let [r1, b1, l1, t1] = this.genitore1.slave.getInfoBoundary();
        let [r2, b2, l2, t2] = this.genitore2.slave.getInfoBoundary();
        if (t2 <= b1 && t1 <= b2 && l2 <= r1 && l1 <= r2) {
            console.log("intersection!");
            return true;
        }
        else {
            console.log("no intersection");
            return false;
        }
    }
}
// zona sperimentazione - 2--->√    
let fuffy = new Dio();
let c0 = fuffy.creazione('cerchio', [1], 'blue');
let r1 = fuffy.creazione('rettangolo', [1, 1]);
let r2 = fuffy.creazione('rettangolo', [1, 1], 'red');
r1.slave.traslaDX();
let r3 = fuffy.creazione('rettangolo', [1, 1], 'green');
r3.slave.traslaDX();
r3.slave.traslaUP();
let cons12 = new ConsulenzaDiCoppiaRettangoli(r1, r2);
r1.slave.traslaDN();
/* cons12.verifyIntersection(); */
let cons13 = new ConsulenzaDiCoppiaRettangoli(r1, r3);
/* cons13.verifyIntersection(); */
r1.slave.position(0, 0, 0);
r1.slave.position(400, 100, 0);
let info = (_a = document.getElementById("shapes")) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
let [r, b, l, t] = [info === null || info === void 0 ? void 0 : info.right, info === null || info === void 0 ? void 0 : info.bottom, info === null || info === void 0 ? void 0 : info.left, info === null || info === void 0 ? void 0 : info.top];
console.log(r, b, l, t);
//mettere controlli per evitare che le forme vadano fuori dal bordo!!!
//max trasl dx = 675
// max trasl up = 0
//max tras sx = 0
//max trasl dn = 1100
r1.slave.position(640, 0, 0);
r1.slave.position(675, 0, 0);
r2.slave.position(0, 0, 0);
r3.slave.position(0, 1100, 0);
class Game {
    constructor(difficoltà, shiva) {
        this.difficoltà = difficoltà;
    }
    inizializeSelf() {
    }
}
