//forme bidimensionali

let shapeIndex:number=0; //serve ad individuare id delle figure create
type shape = 'quadrato'|'rettangolo'|'cerchio'|'cubo';
let shapeArray:Shape[]=[];//contiene le figure create

//I due elementi fondamentali
class ShapeSlave{ 
//realizza uno schiavo che sposta la forma assegnatagli per contrappasso, la fa ruotare
//calcola la sua area
    transformed:number[]; //array 6-dimensioni, segna stato delle tre coordinate spaziali e dei tre angoli di rotazione
    shape:Shape;
    
    constructor(shape:Shape){
        this.shape=shape;
        this.transformed=[0,0,0,0,0,0];
    }
    calcolaArea():number{
        switch(this.shape.forma){
            case 'cerchio': return Math.pow(this.shape.measures[0],2)*Math.PI;
            case 'rettangolo': return this.shape.measures[0]*this.shape.measures[1];
            case 'cubo': return Math.pow(this.shape.measures[0],3);
            default: return -1;
        }
    }
    getDomElement(): HTMLElement { //restituisce HTMLElement della Shape 
        let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        if (t != null) {
            return t;
        } else { console.log("elemento non trovato!"); return document.body; }  
    }
    getInfoBoundary(): number[]{
        let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        if (t != null) {
            let BQ = t.getBoundingClientRect();
            console.log("boundaries:");
            console.log(BQ.right, BQ.bottom, BQ.left, BQ.top);
            console.log("height, width:", BQ.height, BQ.width);
            return [BQ.right, BQ.bottom, BQ.left, BQ.top];
        }
        else { console.log("elemento del dom non trovato!"); return [-1]; }
           }
    applyTransformation(): void{
        let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
        if (t != null) {
            t.style.transform = `
        translate3d(${this.transformed[0]}px, ${this.transformed[1]}px, ${this.transformed[2]}px)
        rotateX(${this.transformed[3]}deg)
        rotateY(${this.transformed[4]}deg)
        rotateZ(${this.transformed[5]}deg)`;
        } else { console.log("elemento del dom da trasformare non trovato!"); }
            
    }
    position(x: number, y: number, z?: number): void {
        this.transformed[0] = x;
        this.transformed[1] = y;
        if (z != undefined) { this.transformed[2] = z; }
        this.applyTransformation();
     }
    traslaDX():void{
        this.transformed[0]+=100;
        this.applyTransformation();
    }
    traslaSX():void{
    this.transformed[0]-=100;
        this.applyTransformation();
    
    }
    traslaDN():void{
        this.transformed[1]+=100;
        this.applyTransformation();
    }
    traslaUP():void{
        this.transformed[1]-=100;
        this.applyTransformation();
    }
    traslaNear():void{
        this.transformed[2]+=300;
        this.applyTransformation();
    }
    traslaAway():void{
        this.transformed[2]-=300;
        this.applyTransformation();
    }
    ruotaXP():void{
        this.transformed[3]+=45;
        this.applyTransformation();
    }
    ruotaXN():void{
        this.transformed[3]-=45;
        this.applyTransformation();
    }
    ruotaYP():void{
        this.transformed[4]+=45;
        this.applyTransformation();
    }
    ruotaYN():void{
        this.transformed[4]-=45;
        this.applyTransformation();
    }
    ruotaZP():void{
        this.transformed[5]+=45;
        this.applyTransformation();
    }
    ruotaZN():void{
        this.transformed[5]-=45;
        this.applyTransformation();
    }

};
interface Shape{ 
    //contiene:
    //measures---> misure della figura 
    //shapeIndex ---> indicizzazione della figura rispetto alle figure già create
    //shape -->dice il tipo di figura
    //creaNelDOM() --->crea la figura nel dom
    measures: number[];
    shapeIndex: number;
    forma:shape; 
    creaNelDOM(colore:string):void;     
};
function constructionString(forma:shape, measures: number[], color:string='grey'):string{
//ritorna la stringa da aggiungere al body per creare l'elemento
//corrispondente ai parametri
switch(forma){
    case 'cerchio': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color:${color}; height:${measures[0]*100}px; width:${measures[0]*100}px; border-radius:50%"> ${shapeIndex} </div>`; 
    case 'rettangolo':return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color: ${color};  height: ${measures[0]*100}px; width:${measures[1]*100}px"> ${shapeIndex}</div>`;
    case 'cubo': return ''; //ATTENZIONE!! Inserire cubo
    default: return 'forma non trovata';
}
};
class Cerchio implements Shape{
    measures: number[];//array che contiene il raggio
    shapeIndex: number;
    forma:shape= 'cerchio';
    
constructor(raggio:number, color?:string){
    this.measures=[raggio];
    this.shapeIndex=shapeIndex;
    this.creaNelDOM(color);
    shapeIndex+=1;
}

    creaNelDOM(color?: string): void{
        let t = document.getElementById('shapes');
        if (t != null) {
            t.innerHTML += constructionString(this.forma, this.measures, color);
        }
        else { 
            console.log("errore contenitore shapes non trovato");
        }
    }

};
class Rettangolo implements Shape{

    measures: number[];//contiene base e altezza
    shapeIndex:number;
    forma:shape='rettangolo';

    constructor(base:number, altezza:number, color?:string){
        this.measures=[base, altezza];
        this.shapeIndex=shapeIndex;
        this.creaNelDOM(color);
        shapeIndex+=1;
    }
    creaNelDOM(color?: string): void {
        let t = document.getElementById('shapes');
        if (t != null) {
            t.innerHTML += constructionString(this.forma, this.measures, color);
        }
        else { 
            console.log("errore contenitore shapes non trovato");
        }
    }
};
class Quadrato extends Rettangolo{
        constructor(lato:number, color?:string){
            super(lato, lato, color);
        }
};


//area sperimentazione - 1 ---> √
/*
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

//secondo livello 

interface Civis{ //un cittadino libero: consiste di una Shape e di un ShapeSlave
    shape:Shape;
    slave:ShapeSlave;
}

class Dio{ //colui che crea e distrugge


    creazione(s:shape,measures:number[], color?:string):Civis{ //ritorna istanza di Shape con ShapeSlave associato
        switch(s){
            case 'cerchio': let c = new Cerchio(measures[0], color); let s = new ShapeSlave(c); return {shape:c, slave:s}; 
            case 'rettangolo': let r = new Rettangolo(measures[0], measures[1], color); let t = new ShapeSlave(r); return {shape:r, slave:t};
            default : let blowup= new Rettangolo(100,100); return {shape:blowup, slave:new ShapeSlave(blowup)};        
        }
        }

}

class ConsulenzaDiCoppiaRettangoli{
    genitore1:Civis;
    genitore2:Civis;
    constructor(genitore1:Civis, genitore2:Civis){
        this.genitore1=genitore1;
        this.genitore2=genitore2;
    }

    verifyIntersection(): boolean{
    let [r1, b1,l1,t1]= this.genitore1.slave.getInfoBoundary();
    let [r2,b2,l2,t2]=this.genitore2.slave.getInfoBoundary();
    if(t2<=b1&&t1<=b2&&l2<=r1&&l1<=r2){
        console.log("intersection!");
        return true;
    }else {console.log("no intersection"); return false;}
    }


}

// zona sperimentazione - 2--->√    

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
/* cons12.verifyIntersection(); */
let cons13 = new ConsulenzaDiCoppiaRettangoli(r1, r3);
/* cons13.verifyIntersection(); */

r1.slave.position(0, 0, 0);
r1.slave.position(400, 100, 0);

let info = document.getElementById("shapes")?.getBoundingClientRect();
let [r, b, l, t] = [info?.right, info?.bottom, info?.left, info?.top];

console.log(r, b, l, t);


//mettere controlli per evitare che le forme vadano fuori dal bordo!!!
//max trasl dx = 675
// max trasl up = 0
//max tras sx = 0
//max trasl dn = 1100
r1.slave.position(640,0,0);
r1.slave.position(675, 0, 0);
r2.slave.position(0, 0, 0);
r3.slave.position(0, 1100, 0);



/* Game */

type difficoltà = 'easy' | 'medium' | 'manicomio';
class Game {
    difficoltà: difficoltà;
    fuffy: Dio;
    constructor(difficoltà: difficoltà, shiva: Dio) { 
        this.difficoltà = difficoltà;
    }

    inizializeSelf() { 
    }


}

