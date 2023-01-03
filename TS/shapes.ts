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
    domE:HTMLElement;
    constructor(shape:Shape){
        this.shape=shape;
        this.domE=document.getElementById(`Fig-${this.shape.shapeIndex}`);
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
    getInfoBoundary():number[]{
       let BQ= this.domE.getBoundingClientRect();
       console.log("boundaries:");
       console.log(BQ.right, BQ.bottom, BQ.left, BQ.top);
       console.log("height, width:", BQ.height, BQ.width);
       return [BQ.right, BQ.bottom, BQ.left, BQ.top];
    }
    applyTransformation():void{
        this.domE.style.transform=`
        translate3d(${this.transformed[0]}px, ${this.transformed[1]}px, ${this.transformed[2]}px)
        rotateX(${this.transformed[3]}deg)
        rotateY(${this.transformed[4]}deg)
        rotateZ(${this.transformed[5]}deg)`;
    }
    traslaDX():void{
        this.transformed[0]+=100;
        this.applyTransformation();
        console.log(this.shape.domE);
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

}
interface Shape{ 
    //contiene:
    //measures---> misure della figura 
    //domE---> HTMLElement corrispondente nel dom
    //shapeIndex ---> indicizzazione della figura rispetto alle figure già create
    //shape -->dice il tipo di figura
    //creaNelDOM() --->crea la figura nel dom e restituisce l'HTMLElement
    measures: number[];
    domE:HTMLElement;
    shapeIndex: number;
    forma:shape; 
    creaNelDOM():HTMLElement;     
};

function constructionString(forma:shape, measures: number[]):string{
//ritorna la stringa da aggiungere al body per creare l'elemento
//corrispondente ai parametri
switch(forma){
    case 'cerchio': return `<div class='shape' id="Fig-${shapeIndex}" style=" background-color:green; height:${measures[0]*100}px; width:${measures[0]*100}px; border-radius:50%"> ${shapeIndex} </div>`; 
    case 'rettangolo':return `<div class='shape' id="Fig-${shapeIndex}" style="position:absolute; background-color: grey;  height: ${measures[0]*100}px; width:${measures[1]*100}px"> ${shapeIndex}</div>`;
    case 'cubo': return ''; //ATTENZIONE!! Inserire cubo
    default: return 'forma non trovata';
}
}

class Cerchio implements Shape{
    measures: number[];//array che contiene il raggio
    shapeIndex: number;
    domE:HTMLElement;
    forma:shape= 'cerchio';
    
constructor(raggio:number){
    this.measures=[raggio];
    this.shapeIndex=shapeIndex;
    this.domE= this.creaNelDOM();
    shapeIndex+=1;
}

    creaNelDOM():HTMLElement{
        document.getElementById('shapes').innerHTML+=constructionString(this.forma, this.measures);
        return document.getElementById(`Fig-${shapeIndex}`);
    }

}
class Rettangolo implements Shape{

    measures: number[];//contiene base e altezza
    shapeIndex:number;
    domE:HTMLElement;
    forma:shape='rettangolo';

    constructor(base:number, altezza:number){
        this.measures=[base, altezza];
        this.shapeIndex=shapeIndex;
        this.domE=this.creaNelDOM();
        shapeIndex+=1;
    }
    creaNelDOM(): HTMLElement {
        document.getElementById('shapes').innerHTML+=constructionString(this.forma, this.measures);        
        return document.getElementById(`Fig-${shapeIndex}`);
    }
}
class Quadrato extends Rettangolo{
        constructor(lato:number){
            super(lato, lato);
        }
    }


//area sperimentazione - 1
let cerchio = new Cerchio(1);
let quadrato = new Quadrato(1);
let slaveCerchio= new ShapeSlave(cerchio);
let slaveQuadrato=new ShapeSlave(quadrato);



let BQ = slaveQuadrato.domE.getBoundingClientRect();
window.addEventListener("keyup", function(e){
    switch(e.key){//trasla
        case '6':  slaveQuadrato.traslaDX(); slaveQuadrato.getInfoBoundary(); break;
        case '4':  slaveQuadrato.traslaSX(); slaveQuadrato.getInfoBoundary(); break;
        case '8':  slaveQuadrato.traslaUP(); slaveQuadrato.getInfoBoundary(); break;
        case '2':  slaveQuadrato.traslaDN(); slaveQuadrato.getInfoBoundary(); break;       
    }
});

//secondo livello 

interface Civis{ //un cittadino libero: consiste di una Shape e di un ShapeSlave
    shape:Shape;
    slave:ShapeSlave;
}


class Dio{ //colui che crea e distrugge


    creazione(s:shape,measures:number[]):Civis{ //ritorna istanza di Shape con ShapeSlave associato
        switch(s){
            case 'cerchio': let c=new Cerchio(measures[0]); return {shape:c, slave:new ShapeSlave(c)}; 
            case 'rettangolo':let r=new Rettangolo(measures[0], measures[1]); return {shape:r, slave:new ShapeSlave(r)};
            default : let blowup= new Rettangolo(100,100); return {shape:blowup, slave:new ShapeSlave(blowup)};        
        }
        }
}

class consulenzaDiCoppiaRettangoli{
    genitore1:Civis;
    genitore2:Civis;
    constructor(genitore1:Civis, genitore2:Civis){
        this.genitore1=genitore1;
        this.genitore2=genitore2;
    }

    verifyIntersection():boolean{
    let [r1, b1,l1,t1]= this.genitore1.slave.getInfoBoundary();
    let [r2,b2,l2,t2]=this.genitore2.slave.getInfoBoundary();
    if(t2<=b1&&t1<=b2&&l2<=r1&&l1<=r2){
        console.log("intersection");
        return true;
    }else {return false;}
    }

}

let fuffy = new Dio();

let carlina= fuffy.creazione('rettangolo', [1,1]);
