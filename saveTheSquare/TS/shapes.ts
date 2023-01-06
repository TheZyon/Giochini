/* variabili */
let shapeIndex: number = 0; //serve ad individuare id delle figure create
type shape = 'quadrato'|'rettangolo'|'cerchio'|'cubo';
let campo = document.getElementById("shapes");
let [traslMaxX, traslMaxY]: [number, number] = [700, 1125]; //valori max traslazioni in x e y;

type difficoltà = 'easy' | 'medium' | 'manicomio';
let crashAudio = new Audio("../audio/crash.mp3");
let babyAudio = new Audio("../audio/eat.mp3");
let playerBittenAudio = new Audio("../audio/cry.mp3");
let audioVittoria = new Audio("../audio/slurp_v.mp3");
let audioSconfitta = new Audio("../audio/slurp.mp3");
window.addEventListener("mousedown", function () { 
    crashAudio.play()
});

/* classi & interfacce */
    class ShapeSlave {//schiavo che sposta la forma assegnatagli, e calcola parametri

        transformed: number[]; //array 6-dimensioni, segna stato delle tre coordinate spaziali e dei tre angoli di rotazione
        shape: Shape;
        traslationPower: number = 75;
        rotationPower: number = 45;
        constructor(shape: Shape) {
            this.shape = shape;
            this.transformed = [0, 0, 0, 0, 0, 0];
        }

        //metodi per info sulla Shape
        calcolaArea(): number {
            switch (this.shape.forma) {
                case 'cerchio': return Math.pow(this.shape.measures[0], 2) * Math.PI;
                case 'rettangolo': return this.shape.measures[0] * this.shape.measures[1];
                case 'cubo': return Math.pow(this.shape.measures[0], 3);
                default: return -1;
            }
        }
        getDomElement(): HTMLElement { //restituisce HTMLElement della Shape 
            let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
            if (t != null) {
                return t;
            } else { console.log("elemento non trovato!"); return document.body; }
        }
        getInfoBoundary(): number[] {
            let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
            if (t != null) {
                let BQ = t.getBoundingClientRect();
                return [BQ.right, BQ.bottom, BQ.left, BQ.top];
            }
            else { console.log("elemento del dom non trovato!"); return [-1, -1, -1, -1]; }
        }
        getCenter(): number[] { //ritorna le coordinate del centro
            let [r, b, l, t] = this.getInfoBoundary();
            return [l + (r - l) / 2, t + (b - t) / 2];
        }
        //metodi per trasformare la shape
        applyTransformation(): void {
            let t = document.getElementById(`Fig-${this.shape.shapeIndex}`);
            if (t != null) {
                t.style.transform = `
        translate3d(${this.transformed[0]}px, ${this.transformed[1]}px, ${this.transformed[2]}px)
        rotateX(${this.transformed[3]}deg)
        rotateY(${this.transformed[4]}deg)
        rotateZ(${this.transformed[5]}deg)`;
            }
            
        }
        position(x: number, y: number, z?: number): void {
            this.transformed[0] = x;
            this.transformed[1] = y;
            if (z != undefined) { this.transformed[2] = z; }
            this.applyTransformation();
        }
        traslaDX(): void {
            this.transformed[0] += this.traslationPower;
            this.applyTransformation();
        }
        traslaSX(): void {
            this.transformed[0] -= this.traslationPower;
            this.applyTransformation();
    
        }
        traslaDN(): void {
            this.transformed[1] += this.traslationPower;
            this.applyTransformation();
        }
        traslaUP(): void {
            this.transformed[1] -= this.traslationPower;
            this.applyTransformation();
        }
        traslaNear(): void {
            this.transformed[2] += this.traslationPower;
            this.applyTransformation();
        }
        traslaAway(): void {
            this.transformed[2] -= this.traslationPower;
            this.applyTransformation();
        }
        ruotaXP(): void {
            this.transformed[3] += this.traslationPower;
            this.applyTransformation();
        }
        ruotaXN(): void {
            this.transformed[3] -= this.traslationPower;
            this.applyTransformation();
        }
        ruotaYP(): void {
            this.transformed[4] += this.traslationPower;
            this.applyTransformation();
        }
        ruotaYN(): void {
            this.transformed[4] -= this.traslationPower;
            this.applyTransformation();
        }
        ruotaZP(): void {
            this.transformed[5] += this.traslationPower;
            this.applyTransformation();
        }
        ruotaZN(): void {
            this.transformed[5] -= this.traslationPower;
            this.applyTransformation();
        }

        /* traslazioni che si fermano prima di superare il bordo verde
        meno una traslazione */
    
        traslaDX_B(): void {
            if (campo != null){
                if (this.getInfoBoundary()[0] <= campo?.getBoundingClientRect().right - this.traslationPower - 7) {
                this.traslaDX();
            }
         }
              
        }
        traslaSX_B(): void {
            if (campo != null) { if (this.getInfoBoundary()[2] >= campo?.getBoundingClientRect().left + this.traslationPower + 7) {
                    this.traslaSX();
                }
             }
               
        }
        traslaUP_B(): void {
             if (campo != null) { if (this.getInfoBoundary()[3] >= campo?.getBoundingClientRect().top + this.traslationPower + 5) {
                    this.traslaUP();
                }}
                
            
        }
        traslaDN_B(): void {
    if (campo != null) { if (this.getInfoBoundary()[1] <= campo?.getBoundingClientRect().bottom - this.traslationPower - 7) {
                    this.traslaDN();
                }}
                
            
        }

        /* traslazioni che dipendono dalla distanza dal bordo verde
           e producono audio crush 
        */

        traslaDX_B1(): void {
            if (campo != null) { let p = this.traslationPower;
            if (this.getInfoBoundary()[0] <= campo?.getBoundingClientRect().right - this.traslationPower) {
                this.traslaDX();
                /* console.log(this.getInfoBoundary()[0], rightBorderValue - this.traslationPower); */
            } else {
                this.traslationPower = campo?.getBoundingClientRect().right - this.getInfoBoundary()[0] - 7;
                /*  console.log(this.traslationPower); */
                this.traslaDX();
                crashAudio.play();
            }
            this.traslationPower = p;}
            
        }
        traslaSX_B1(): void {
            if (campo != null) { let p = this.traslationPower;
            if (this.getInfoBoundary()[2] >= campo?.getBoundingClientRect().left + this.traslationPower) {
                this.traslaSX();
        
            } else {
                this.traslationPower = this.getInfoBoundary()[2] - campo?.getBoundingClientRect().left - 4;
                this.traslaSX()
                crashAudio.play();
            }
            this.traslationPower = p;}
            
        }
        traslaUP_B1(): void {
            if (campo != null) {let p = this.traslationPower;
            if (this.getInfoBoundary()[3] >= campo?.getBoundingClientRect().top + this.traslationPower) {
                this.traslaUP();
        
            } else {
                this.traslationPower = this.getInfoBoundary()[3] - campo?.getBoundingClientRect().top - 5;
                this.traslaUP();
                crashAudio.play();
            }
            this.traslationPower = p; }
            
        }
        traslaDN_B1(): void {
            if (campo != null) { let p = this.traslationPower;
            /*       console.log(this.getInfoBoundary()[1], bottomBorderValue - this.traslationPower);
                  console.log(this.traslationPower);  */
            if (this.getInfoBoundary()[1] <= campo?.getBoundingClientRect().bottom - this.traslationPower) {
                this.traslaDN();
        
            } else {
                this.traslationPower = campo?.getBoundingClientRect().bottom - this.getInfoBoundary()[1] - 5;
                /*   console.log("attivato") */
                console.log(this.traslationPower);
                this.traslaDN()
                crashAudio.play();
            }
            this.traslationPower = p;}
            
        }
    
        //metodi per trasformare proprietà dello Slave
        setTraslationPower(p: number): void {
            this.traslationPower = p;
        }
        setRotationPower(p: number): void {
            this.rotationPower = p;
        }

    };
    interface Shape {//forma geometrica
        //contiene:
        //measures---> misure della figura 
        //shapeIndex ---> indicizzazione della figura rispetto alle figure già create
        //shape -->dice il tipo di figura
        //creaNelDOM() --->crea la figura nel dom
        measures: number[];
        shapeIndex: number;
        forma: shape;
        creaNelDOM(colore: string): void;
    };
    function constructionString(forma: shape, measures: number[], color: string = 'grey'): string {
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
    };
    class Cerchio implements Shape {
        measures: number[];//array che contiene il raggio
        shapeIndex: number;
        forma: shape = 'cerchio';
    
        constructor(raggio: number, color?: string) {
            this.measures = [raggio];
            this.shapeIndex = shapeIndex;
            this.creaNelDOM(color);
            shapeIndex += 1;
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
    class Rettangolo implements Shape {

        measures: number[];//contiene base e altezza
        shapeIndex: number;
        forma: shape = 'rettangolo';

        constructor(base: number, altezza: number, color?: string) {
            this.measures = [base, altezza];
            this.shapeIndex = shapeIndex;
            this.creaNelDOM(color);
            shapeIndex += 1;
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
    class Quadrato extends Rettangolo {
        constructor(lato: number, color?: string) {
            super(lato, lato, color);
        }
    };
    class Cubo implements Shape {
    measures: number[] = [];
    shapeIndex: number;
    forma: shape = 'cubo';
    constructor(color?: string) { 
        this.shapeIndex = shapeIndex;   
        this.creaNelDOM(color);
        shapeIndex += 1;
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

    interface Civis { //un cittadino libero: consiste di una Shape e di un ShapeSlave
        shape: Shape;
        slave: ShapeSlave;
    }
    class Dio {//creazione ---> crea un Civis con Shape di tipo, misure e colore a scelta

        creazione(s: shape, measures: number[], color?: string): Civis { //ritorna istanza di Shape con ShapeSlave associato
            switch (s) {
                case 'cerchio': let c = new Cerchio(measures[0], color); let s = new ShapeSlave(c); return { shape: c, slave: s };
                case 'rettangolo': let r = new Rettangolo(measures[0], measures[1], color); let t = new ShapeSlave(r); return { shape: r, slave: t };
                default: let blowup = new Rettangolo(100, 100); return { shape: blowup, slave: new ShapeSlave(blowup) };
            }
        }
        distruzione(shapeIndex: number): void {//elimina elemento dal dom 
            document.getElementById(`Fig-${shapeIndex}`)?.remove();
        }
    }
    class ConsulenzaDiCoppiaRettangoli {
        genitore1: Civis;
        genitore2: Civis;
        constructor(genitore1: Civis, genitore2: Civis) {
            this.genitore1 = genitore1;
            this.genitore2 = genitore2;
        }

        verifyIntersection(): boolean { //verifica se si stanno intersecando
            let [r1, b1, l1, t1] = this.genitore1.slave.getInfoBoundary();
            let [r2, b2, l2, t2] = this.genitore2.slave.getInfoBoundary();
            if (t2 <= b1 && t1 <= b2 && l2 <= r1 && l1 <= r2) {
                /*   console.log("intersection!"); */
                return true;
            } else { return false; }
        }
        centersDistance(): number {//ritorna la distanza tra i centri 
            let [c1, c2] = [this.genitore1.slave.getCenter(), this.genitore2.slave.getCenter()];
            let d = Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2));
            return d;
        }
    }

    /* Game */

    class Game {//classe che inizializza il gioco.

    /* arrayConsyulentiCoppia ---> 
    contiene consulenti di coppia nell'ordine
    
    1. per coppie [gamer, nemico];
    2. per coppia [gamer,destinazione];
    3. per coppie [destinazione,nemico];
    
    */
    
    difficoltà: difficoltà;
    fuffy: Dio;
    gamer: Civis;
    destinazione: Civis;
    arrayNemici: Civis[] = [];
    arrayConsulentiCoppia: ConsulenzaDiCoppiaRettangoli[] = [];
    HP: number = 300; //salute iniziale giocatore
    movementIntervalArray: number[] =[];
    constructor(difficoltà: difficoltà, shiva: Dio) {
        this.difficoltà = difficoltà;
        this.fuffy = shiva;
        [this.gamer, this.arrayNemici, this.destinazione] = [this.creaGamer('blue'), this.creaNemici(), this.creaGamer('blue')];
        this.arrayConsulentiCoppia = this.creaConsulentiCoppia();
        this.initGame();
    }
    //metodi per creare personaggi
    creaGamer(color: string): Civis { //crea un Civis quadrato 75px*75px di colore scelto e lo ritorna
        console.log("creato Mariello");
        return this.fuffy.creazione('rettangolo', [1, 1], color);
    }
    creaNemici(): Civis[] { //crea i nemici e restituisce arrayNemici aggiornato
        let numNemici: number = 0;
        let array: Civis[] = [];
        switch (this.difficoltà) {
            case "easy": numNemici = 5; break;
            case "medium": numNemici = 10; break;
            case "manicomio": numNemici = 50; break;
        }
        for (let i = 0; i < numNemici; i++) {
            array.push(this.creaGamer('red'));
        }
        return array;
    }
    creaConsulentiCoppia(): ConsulenzaDiCoppiaRettangoli[] {
        let array: ConsulenzaDiCoppiaRettangoli[] = [];
        
        this.arrayNemici.forEach(enemy => {
            array.push(new ConsulenzaDiCoppiaRettangoli(this.gamer, enemy));
        });
        
        array.push(new ConsulenzaDiCoppiaRettangoli(this.gamer, this.destinazione));

        this.arrayNemici.forEach(enemy => {
            array.push(new ConsulenzaDiCoppiaRettangoli(enemy, this.destinazione));
        });
        return array;
    }
    initPositionNemici(): void { //posiziona gli elementi di arrayNemici NEL RIQUADRO VEDRE
        //secondo coppie di posizioni casuali
        //la posizione y è t.c. i nemici si trivano nel secondo terzo verticale del riquadro
        let l = 150;
        this.arrayNemici.forEach(e => {
            let rndX = Math.round(l + Math.random() * (traslMaxX - 2*l));
            let rndY = Math.round(2*l + Math.random() * (traslMaxY - 4*l));
            e.slave.position(rndX, rndY, 0);
        });
    }
    setMovimentoNemico(nemico: Civis, tempoMovimento: number): void { //setta velocità nemico specifico
        
        let s=setInterval(function () {
            let direzione = Math.floor(Math.random() * 4 + 1); //intero casuale da 1 a 4
            switch (direzione) {
                case 1: nemico.slave.traslaDX_B(); break;
                case 2: nemico.slave.traslaSX_B(); break;
                case 3: nemico.slave.traslaUP_B(); break;
                case 4: nemico.slave.traslaDN_B(); break;
            }
        }, tempoMovimento);
        this.movementIntervalArray.push(s);
    }
    initMovimentoNemici(): void {
        let a = this.arrayNemici;
        a.forEach(nemico => {
            this.setMovimentoNemico(nemico, 300)
        });
    }
    ferimento(danno?: number): void {
        if (danno == undefined) { danno = 50; }
        this.HP -= danno;
        let salute = document.getElementById("pos");
        if (salute != null) {
            salute.style.setProperty('animation', '1s danno');
            setTimeout(function () { salute?.style.removeProperty('animation'); }, 1000);
            salute.style.width = `${Math.max(this.HP, 0)}px`;
            playerBittenAudio.play();
            if (this.HP <= 0) { this.sconfitta(); }
        } else {
            console.log("barra salute non trovata!")
        }
            
    }
    aumentoSalute(pillolicchia?: number): void {
        if (pillolicchia == undefined) { pillolicchia = 300; }
        this.HP =Math.min(300, this.HP+pillolicchia) ;
        let salute = document.getElementById("pos");
        if (salute != null) {
            salute.style.width = `${this.HP}px`;
        } else { console.log("barra salute non trovata"); }
    }
    manageInteractions(): void { //verifica se vi è qualche intersezione e modifica il gioco di conseguenza
        let out = document.getElementById("out")?.children[0];
        
            this.arrayConsulentiCoppia.forEach(
            (consulenza, n) => {
                let result = consulenza.verifyIntersection();
                    switch (0 == 0) {
                        case n < this.arrayNemici.length: if (result == true) { if (out != undefined) { out.innerHTML = "sei stato morso";} this.ferimento();} break;
                        case n == this.arrayNemici.length:  if (result == true) { console.log("vittoria!"); this.vittoria(); } break;
                        case n > this.arrayNemici.length: if (result == true) { if (out != undefined) { out.innerHTML = "OMG the babyyy"; this.sconfitta();} break; }
                        //inserire caso potenziamento    
                    }
            });
        
    }
    outClearer(): void{
        let out = document.getElementById("out")?.children[0];
        setInterval(function () { if (out != undefined) { out.innerHTML = '';}}, 2000);
        
    }
    vittoria(): void { 
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
        else { console.log("messaggio di vittoria non trovato nel dom!"); }
    }
    sconfitta(): void { 
        let messagginoInoIno = document.getElementById("alert");
        if (messagginoInoIno != null) { 
            messagginoInoIno.innerHTML = `
            <p>You have been killed</p>
            <p>La natura è fatta così, ora lo sai</p>`;
            messagginoInoIno.style.zIndex = '3';
            this.movementIntervalArray.forEach(interval => { clearInterval(interval); }); //ferma i movimenti dei nemici
            babyAudio.play();
        }
        else { console.log("messaggio di vittoria non trovato nel dom!"); }
    }
    initGame(): void {
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
                switch (e.key) {//trasla
                    case 'l': g.slave.traslaDX_B1(); break;
                    case 'j': g.slave.traslaSX_B1(); break;
                    case 'i': g.slave.traslaUP_B1(); break;
                    case 'k': g.slave.traslaDN_B1(); break;
                }
            });
            //3.
        this.initMovimentoNemici();
        
        //metto i labels sui personaggi
        let baby = document.getElementById(`Fig-${shapeIndex - 1}`);
        if (baby != null) { baby.innerHTML = "B"; }
        let mother = document.getElementById(`Fig-${0}`);
        if (mother != null) { mother.innerHTML = "M"; }
        arrayNemici.forEach(e => { e.slave.getDomElement().innerHTML="C"})
    }
    diluvioUniversale(): void { 
        if (campo != null) { campo.innerHTML = '';}
        
    }
        
    }

/* main */
    
    let fuffy: Dio;
    let partita: Game;
    let int: number;
    
let playButton = document.getElementsByTagName("button")[0];
    
if (sessionStorage.getItem('n_partite') == null) {
    sessionStorage.setItem('n_partite', `0`);
}
    

    gestisciSecondaPartita();

    function gestisciSecondaPartita(): void { //se n_partite è >0, inizia il gioco senza che si prema il pulsante PLAY
    let n_partite: number;
    let n_partiteStr = sessionStorage.getItem('n_partite');
    if (n_partiteStr != null) {
    n_partite = eval(n_partiteStr);
    } else { n_partite = -1; }

    if (n_partite > 0) { 
                fuffy = new Dio();
                partita = new Game('easy', fuffy);
                int = setInterval(function () { partita.manageInteractions() }, 200);
    }}


    playButton.addEventListener("mousedown", function () { 

        let n_partiteStr = sessionStorage.getItem('n_partite');
        let n_partite: number = 0;

        if (n_partiteStr != null) {
            n_partite = eval(n_partiteStr);
            
            switch (n_partite) {
            case 0:
                fuffy = new Dio();
                partita = new Game('easy', fuffy);
                int = setInterval(function () { partita.manageInteractions() }, 200);
                n_partite = 1;
                sessionStorage.setItem('n_partite', `${n_partite}`);
                break;
            default: window.location.reload();   
         }
    
        } else {
            console.log("valore per n_partite non trovato in session storage");
        }
        
        
    
    });
 
  

     

/* 
let cubo1 = new Cubo('red');

let cubeSlave = new ShapeSlave(cubo1);
console.log(cubeSlave.shape.shapeIndex);
cubeSlave.traslaDX()
cubeSlave.traslaDN()
cubeSlave.ruotaYN() */