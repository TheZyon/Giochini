"use strict";
/* variabili */
let shapeIndex = 0; //serve ad individuare id delle figure create
let campo = document.getElementById("shapes");
let [traslMaxX, traslMaxY] = [700, 1125]; //valori max traslazioni in x e y;
let crashAudio = new Audio("../audio/crash.mp3");
let babyAudio = new Audio("../audio/eat.mp3");
let playerBittenAudio = new Audio("../audio/cry.mp3");
let audioVittoria = new Audio("../audio/slurp_v.mp3");
let audioSconfitta = new Audio("../audio/slurp.mp3");
/* classi & interfacce */
class ShapeSlave {
    constructor(shape) {
        this.traslationPower = 75;
        this.rotationPower = 45;
        this.shape = shape;
        this.transformed = [0, 0, 0, 0, 0, 0];
    }
    //metodi per info sulla Shape
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
            return [BQ.right, BQ.bottom, BQ.left, BQ.top];
        }
        else {
            console.log("elemento del dom non trovato!");
            return [-1, -1, -1, -1];
        }
    }
    getCenter() {
        let [r, b, l, t] = this.getInfoBoundary();
        return [l + (r - l) / 2, t + (b - t) / 2];
    }
    //metodi per trasformare la shape
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
        this.transformed[0] += this.traslationPower;
        this.applyTransformation();
    }
    traslaSX() {
        this.transformed[0] -= this.traslationPower;
        this.applyTransformation();
    }
    traslaDN() {
        this.transformed[1] += this.traslationPower;
        this.applyTransformation();
    }
    traslaUP() {
        this.transformed[1] -= this.traslationPower;
        this.applyTransformation();
    }
    traslaNear() {
        this.transformed[2] += this.traslationPower;
        this.applyTransformation();
    }
    traslaAway() {
        this.transformed[2] -= this.traslationPower;
        this.applyTransformation();
    }
    ruotaXP() {
        this.transformed[3] += this.traslationPower;
        this.applyTransformation();
    }
    ruotaXN() {
        this.transformed[3] -= this.traslationPower;
        this.applyTransformation();
    }
    ruotaYP() {
        this.transformed[4] += this.traslationPower;
        this.applyTransformation();
    }
    ruotaYN() {
        this.transformed[4] -= this.traslationPower;
        this.applyTransformation();
    }
    ruotaZP() {
        this.transformed[5] += this.traslationPower;
        this.applyTransformation();
    }
    ruotaZN() {
        this.transformed[5] -= this.traslationPower;
        this.applyTransformation();
    }
    /* traslazioni che si fermano prima di superare il bordo verde
    meno una traslazione */
    traslaDX_B() {
        if (campo != null) {
            if (this.getInfoBoundary()[0] <= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().right) - this.traslationPower - 7) {
                this.traslaDX();
            }
        }
    }
    traslaSX_B() {
        if (campo != null) {
            if (this.getInfoBoundary()[2] >= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().left) + this.traslationPower + 7) {
                this.traslaSX();
            }
        }
    }
    traslaUP_B() {
        if (campo != null) {
            if (this.getInfoBoundary()[3] >= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().top) + this.traslationPower + 5) {
                this.traslaUP();
            }
        }
    }
    traslaDN_B() {
        if (campo != null) {
            if (this.getInfoBoundary()[1] <= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().bottom) - this.traslationPower - 7) {
                this.traslaDN();
            }
        }
    }
    /* traslazioni che dipendono dalla distanza dal bordo verde
       e producono audio crush
    */
    traslaDX_B1() {
        if (campo != null) {
            let p = this.traslationPower;
            if (this.getInfoBoundary()[0] <= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().right) - this.traslationPower) {
                this.traslaDX();
                /* console.log(this.getInfoBoundary()[0], rightBorderValue - this.traslationPower); */
            }
            else {
                this.traslationPower = (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().right) - this.getInfoBoundary()[0] - 7;
                /*  console.log(this.traslationPower); */
                this.traslaDX();
                crashAudio.play();
            }
            this.traslationPower = p;
        }
    }
    traslaSX_B1() {
        if (campo != null) {
            let p = this.traslationPower;
            if (this.getInfoBoundary()[2] >= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().left) + this.traslationPower) {
                this.traslaSX();
            }
            else {
                this.traslationPower = this.getInfoBoundary()[2] - (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().left) - 4;
                this.traslaSX();
                crashAudio.play();
            }
            this.traslationPower = p;
        }
    }
    traslaUP_B1() {
        if (campo != null) {
            let p = this.traslationPower;
            if (this.getInfoBoundary()[3] >= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().top) + this.traslationPower) {
                this.traslaUP();
            }
            else {
                this.traslationPower = this.getInfoBoundary()[3] - (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().top) - 5;
                this.traslaUP();
                crashAudio.play();
            }
            this.traslationPower = p;
        }
    }
    traslaDN_B1() {
        if (campo != null) {
            let p = this.traslationPower;
            /*       console.log(this.getInfoBoundary()[1], bottomBorderValue - this.traslationPower);
                  console.log(this.traslationPower);  */
            if (this.getInfoBoundary()[1] <= (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().bottom) - this.traslationPower) {
                this.traslaDN();
            }
            else {
                this.traslationPower = (campo === null || campo === void 0 ? void 0 : campo.getBoundingClientRect().bottom) - this.getInfoBoundary()[1] - 5;
                /*   console.log("attivato") */
                console.log(this.traslationPower);
                this.traslaDN();
                crashAudio.play();
            }
            this.traslationPower = p;
        }
    }
    //metodi per trasformare proprietà dello Slave
    setTraslationPower(p) {
        this.traslationPower = p;
    }
    setRotationPower(p) {
        this.rotationPower = p;
    }
}
;
;
function constructionString(forma, measures, color = 'grey') {
    //ritorna la stringa da aggiungere al body per creare l'elemento
    //corrispondente ai parametri
    switch (forma) {
        case 'cerchio': return `<div class='shape' id="Fig-${shapeIndex}" style="background-color:${color}; height:${measures[0] * 75}px; width:${measures[0] * 75}px; border-radius:50%"> ${shapeIndex} </div>`;
        case 'rettangolo': return `<div class='shape' id="Fig-${shapeIndex}" style="background-color: ${color};  height: ${measures[0] * 75}px; width:${measures[1] * 75}px"> ${shapeIndex}</div>`;
        case 'cubo': return `<div class="scene">
                                 <div class="cube" id="Fig-${shapeIndex}">
                                    <div class="cube__face cube__face--front" style="background-color:${color}">D</div>
                                    <div class="cube__face cube__face--back" style="background-color:${color}">I</div>
                                    <div class="cube__face cube__face--right" style="background-color:${color}">O</div>
                                    <div class="cube__face cube__face--left" style="background-color:${color}">C</div>
                                    <div class="cube__face cube__face--top" style="background-color:${color}">A</div>
                                    <div class="cube__face cube__face--bottom" style="background-color:${color}">N</div>
                                 </div>
                                </div>`;
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
class Cubo {
    constructor(color) {
        this.measures = [];
        this.forma = 'cubo';
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
    distruzione(shapeIndex) {
        var _a;
        (_a = document.getElementById(`Fig-${shapeIndex}`)) === null || _a === void 0 ? void 0 : _a.remove();
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
            /*   console.log("intersection!"); */
            return true;
        }
        else {
            return false;
        }
    }
    centersDistance() {
        let [c1, c2] = [this.genitore1.slave.getCenter(), this.genitore2.slave.getCenter()];
        let d = Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2));
        return d;
    }
}
/* ZONA SPERIMENTAZIONE - 1 ---> √

let cerchio = new Cerchio(1);
let quadrato = new Quadrato(1);
let retto = new Rettangolo(1, 2);
let slaveCerchio= new ShapeSlave(cerchio);
let slaveQuadrato=new ShapeSlave(quadrato);
let slaveRetto = new ShapeSlave(retto);

window.addEventListener("keyup", function(e){
    switch(e.key){//trasla
        case '6':  slaveQuadrato.traslaDX(); slaveQuadrato.getInfoBoundary(); break;
        case '4':  slaveQuadrato.traslaSX(); slaveQuadrato.getInfoBoundary(); break;
        case '8':  slaveQuadrato.traslaUP(); slaveQuadrato.getInfoBoundary(); break;
        case '2':  slaveQuadrato.traslaDN(); slaveQuadrato.getInfoBoundary(); break;
    }
});

slaveCerchio.traslaDN();
slaveQuadrato.traslaDX();
slaveQuadrato.traslaDX();
slaveRetto.traslaDN();
slaveRetto.traslaDN();
slaveCerchio.traslaDN();
slaveQuadrato.traslaDN();

*/
/* ZONA SPERIMENTAZIONE - 2 ---> √

let fuffy = new Dio();
let c0 = fuffy.creazione('cerchio', [1], 'blue');

let r1=fuffy.creazione('rettangolo', [1, 1]);
let r2 = fuffy.creazione('rettangolo', [1, 1], 'red');
r1.slave.traslaDX();
let r3 = fuffy.creazione('rettangolo', [1, 1], 'green');
r3.slave.traslaDX();
r3.slave.traslaUP();
let cons12 = new ConsulenzaDiCoppiaRettangoli(r1,r2);
r1.slave.traslaDN();
//cons12.verifyIntersection();
let cons13 = new ConsulenzaDiCoppiaRettangoli(r1, r3);
//cons13.verifyIntersection();


r1.slave.position(400, 100, 0);

let info = document.getElementById("shapes")?.getBoundingClientRect();
let [r, b, l, t] = [info?.right, info?.bottom, info?.left, info?.top];

console.log(r, b, l, t);


//mettere controlli per evitare che le forme vadano fuori dal bordo!!!
//max trasl dx = 699
// max trasl up = 0
//max tras sx = 0
//max trasl dn = 1125
r1.slave.position(699, 0, 0);
r2.slave.position(0, 0, 0);
r3.slave.position(0, 1125, 0);*/
/* Game */
class Game {
    constructor(difficoltà, shiva) {
        this.arrayNemici = [];
        this.arrayConsulentiCoppia = [];
        this.HP = 300; //salute iniziale giocatore
        this.movementIntervalArray = [];
        this.difficoltà = difficoltà;
        this.fuffy = shiva;
        [this.gamer, this.arrayNemici, this.destinazione] = [this.creaGamer('blue'), this.creaNemici(), this.creaGamer('blue')];
        this.arrayConsulentiCoppia = this.creaConsulentiCoppia();
        this.initGame();
    }
    //metodi per creare personaggi
    creaGamer(color) {
        console.log("creato Mariello");
        return this.fuffy.creazione('rettangolo', [1, 1], color);
    }
    creaNemici() {
        let numNemici = 0;
        let array = [];
        switch (this.difficoltà) {
            case "easy":
                numNemici = 5;
                break;
            case "medium":
                numNemici = 10;
                break;
            case "manicomio":
                numNemici = 50;
                break;
        }
        for (let i = 0; i < numNemici; i++) {
            array.push(this.creaGamer('red'));
        }
        return array;
    }
    creaConsulentiCoppia() {
        let array = [];
        this.arrayNemici.forEach(enemy => {
            array.push(new ConsulenzaDiCoppiaRettangoli(this.gamer, enemy));
        });
        array.push(new ConsulenzaDiCoppiaRettangoli(this.gamer, this.destinazione));
        this.arrayNemici.forEach(enemy => {
            array.push(new ConsulenzaDiCoppiaRettangoli(enemy, this.destinazione));
        });
        return array;
    }
    initPositionNemici() {
        //secondo coppie di posizioni casuali
        //la posizione y è t.c. i nemici si trivano nel secondo terzo verticale del riquadro
        let l = 150;
        this.arrayNemici.forEach(e => {
            let rndX = Math.round(l + Math.random() * (traslMaxX - 2 * l));
            let rndY = Math.round(2 * l + Math.random() * (traslMaxY - 4 * l));
            e.slave.position(rndX, rndY, 0);
        });
    }
    setMovimentoNemico(nemico, tempoMovimento) {
        let s = setInterval(function () {
            let direzione = Math.floor(Math.random() * 4 + 1); //intero casuale da 1 a 4
            switch (direzione) {
                case 1:
                    nemico.slave.traslaDX_B();
                    break;
                case 2:
                    nemico.slave.traslaSX_B();
                    break;
                case 3:
                    nemico.slave.traslaUP_B();
                    break;
                case 4:
                    nemico.slave.traslaDN_B();
                    break;
            }
        }, tempoMovimento);
        this.movementIntervalArray.push(s);
    }
    initMovimentoNemici() {
        let a = this.arrayNemici;
        a.forEach(nemico => {
            this.setMovimentoNemico(nemico, 300);
        });
    }
    ferimento(danno) {
        if (danno == undefined) {
            danno = 50;
        }
        this.HP -= danno;
        let salute = document.getElementById("pos");
        if (salute != null) {
            salute.style.setProperty('animation', '1s danno');
            setTimeout(function () { salute === null || salute === void 0 ? void 0 : salute.style.removeProperty('animation'); }, 1000);
            salute.style.width = `${Math.max(this.HP, 0)}px`;
            playerBittenAudio.play();
            if (this.HP <= 0) {
                this.sconfitta();
            }
        }
        else {
            console.log("barra salute non trovata!");
        }
    }
    aumentoSalute(pillolicchia) {
        if (pillolicchia == undefined) {
            pillolicchia = 300;
        }
        this.HP = Math.min(300, this.HP + pillolicchia);
        let salute = document.getElementById("pos");
        if (salute != null) {
            salute.style.width = `${this.HP}px`;
        }
        else {
            console.log("barra salute non trovata");
        }
    }
    manageInteractions() {
        var _a;
        let out = (_a = document.getElementById("out")) === null || _a === void 0 ? void 0 : _a.children[0];
        this.arrayConsulentiCoppia.forEach((consulenza, n) => {
            let result = consulenza.verifyIntersection();
            switch (0 == 0) {
                case n < this.arrayNemici.length:
                    if (result == true) {
                        if (out != undefined) {
                            out.innerHTML = "sei stato morso";
                        }
                        this.ferimento();
                    }
                    break;
                case n == this.arrayNemici.length:
                    if (result == true) {
                        console.log("vittoria!");
                        this.vittoria();
                    }
                    break;
                case n > this.arrayNemici.length: if (result == true) {
                    if (out != undefined) {
                        out.innerHTML = "OMG the babyyy";
                        this.sconfitta();
                    }
                    break;
                }
                //inserire caso potenziamento    
            }
        });
    }
    outClearer() {
        var _a;
        let out = (_a = document.getElementById("out")) === null || _a === void 0 ? void 0 : _a.children[0];
        setInterval(function () { if (out != undefined) {
            out.innerHTML = '';
        } }, 2000);
    }
    vittoria() {
        let messagginoInoIno = document.getElementById("alert");
        if (messagginoInoIno != null) {
            messagginoInoIno.innerHTML = ` 
            <p>Pomplimenti!</p>
            <p>Da molto tempo seguo con interesse 
               la sua azienda,
               che trovo molto stimolante,e anche mia nonna,
               ah povera donna!...Si è commossa sul letto di morte
               conoscendo la vostra attenzione per i particolari.
               Pensava di non farcela, e invece..grazie al suo ultimo post
               su linkedin relativo ai metodi per aumentare la produttività 
               è ritornata a vivere...
               Desidero prendervi parte, inoltre vorrei dire che
               console.log(altri_allisciamenti_di_culo).
            </p>`;
            messagginoInoIno.style.zIndex = '3';
            this.movementIntervalArray.forEach(interval => { clearInterval(interval); });
        }
        else {
            console.log("messaggio di vittoria non trovato nel dom!");
        }
    }
    sconfitta() {
        let messagginoInoIno = document.getElementById("alert");
        if (messagginoInoIno != null) {
            messagginoInoIno.innerHTML = `
            <p>You have been killed</p>
            <p>La natura è fatta così, ora lo sai</p>`;
            messagginoInoIno.style.zIndex = '3';
            this.movementIntervalArray.forEach(interval => { clearInterval(interval); }); //ferma i movimenti dei nemici
            babyAudio.play();
        }
        else {
            console.log("messaggio di vittoria non trovato nel dom!");
        }
    }
    initGame() {
        /*
        1. Setta la posizione iniziale nemici e destinazione
        2. mette EL per permettere di muovere il gamer con pulsanti tastiera
        3. inizializza il movimento dei nemici
        4.
        */
        let g = this.gamer;
        let arrayNemici = this.arrayNemici;
        let arrayConsulenti = this.arrayConsulentiCoppia;
        this.outClearer();
        //1.
        this.destinazione.slave.position(traslMaxX - 30, traslMaxY - 20);
        this.initPositionNemici(); //migliorare in modo che i nemici non si intersechino
        //2.
        window.addEventListener("keyup", function (e) {
            switch (e.key) { //trasla
                case 'l':
                    g.slave.traslaDX_B1();
                    break;
                case 'j':
                    g.slave.traslaSX_B1();
                    break;
                case 'i':
                    g.slave.traslaUP_B1();
                    break;
                case 'k':
                    g.slave.traslaDN_B1();
                    break;
            }
        });
        //3.
        this.initMovimentoNemici();
    }
    diluvioUniversale() {
        for (let i = 0; i < shapeIndex; i++)
            fuffy.distruzione(i);
    }
}
let fuffy;
let partita;
let playButton = document.getElementsByTagName("button")[0];
playButton.addEventListener("mousedown", function () {
    if (partita != undefined) {
        partita.diluvioUniversale();
        let messagginoInoIno = document.getElementById("alert");
        if (messagginoInoIno != null) {
            messagginoInoIno.style.zIndex = '1';
        }
        else {
            console.log("alert non trovato nel dom!");
        }
    }
    fuffy = new Dio();
    partita = new Game('easy', fuffy);
    partita.aumentoSalute();
    setInterval(function () { partita.manageInteractions(); }, 200);
});
/*
let cubo1 = new Cubo('red');

let cubeSlave = new ShapeSlave(cubo1);
console.log(cubeSlave.shape.shapeIndex);
cubeSlave.traslaDX()
cubeSlave.traslaDN()
cubeSlave.ruotaYN() */ 
