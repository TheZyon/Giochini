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
    getInfoBoundary() {
        let BQ = this.domE.getBoundingClientRect();
        console.log("boundaries:");
        console.log(BQ.right, BQ.bottom, BQ.left, BQ.top);
        console.log("height, width:", BQ.height, BQ.width);
        return [BQ.right, BQ.bottom, BQ.left, BQ.top];
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
        case 'cerchio': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color:green; height:${measures[0] * 100}px; width:${measures[0] * 100}px; border-radius:50%"> ${shapeIndex} </div>`;
        case 'rettangolo': return `<div class='shape' id="Fig-${shapeIndex}" style="position:absolute; background-color: grey;  height: ${measures[0] * 100}px; width:${measures[1] * 100}px"> ${shapeIndex}</div>`;
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
let quadrato = new Quadrato(1);
let slaveCerchio = new ShapeSlave(cerchio);
let slaveQuadrato = new ShapeSlave(quadrato);
let BQ = slaveQuadrato.domE.getBoundingClientRect();
window.addEventListener("keyup", function (e) {
    switch (e.key) { //trasla
        case '6':
            slaveQuadrato.traslaDX();
            slaveQuadrato.getInfoBoundary();
            break;
        case '4':
            slaveQuadrato.traslaSX();
            slaveQuadrato.getInfoBoundary();
            break;
        case '8':
            slaveQuadrato.traslaUP();
            slaveQuadrato.getInfoBoundary();
            break;
        case '2':
            slaveQuadrato.traslaDN();
            slaveQuadrato.getInfoBoundary();
            break;
    }
});
class Dio {
    creazione(s, measures) {
        switch (s) {
            case 'cerchio':
                let c = new Cerchio(measures[0]);
                return { shape: c, slave: new ShapeSlave(c) };
            case 'rettangolo':
                let r = new Rettangolo(measures[0], measures[1]);
                return { shape: r, slave: new ShapeSlave(r) };
            default:
                let blowup = new Rettangolo(100, 100);
                return { shape: blowup, slave: new ShapeSlave(blowup) };
        }
    }
}
class consulenzaDiCoppiaRettangoli {
    constructor(genitore1, genitore2) {
        this.genitore1 = genitore1;
        this.genitore2 = genitore2;
    }
    verifyIntersection() {
        let [r1, b1, l1, t1] = this.genitore1.slave.getInfoBoundary();
        let [r2, b2, l2, t2] = this.genitore2.slave.getInfoBoundary();
        if (t2 <= b1 && t1 <= b2 && l2 <= r1 && l1 <= r2) {
            console.log("intersection");
            return true;
        }
        else {
            return false;
        }
    }
}
let fuffy = new Dio();
let carlina = fuffy.creazione('rettangolo', [1, 1]);
