var body = document.getElementsByTagName("body")[0];
var cartesWidth = 50,
    cartesHeight = 100,
    cartesPixWidth = 223.5384,
    cartesPixHeight = 312.6;
    
//initialisation des cartes

// 2906*
// unité x=223.5384   y=312.6
var cartesImgs = document.getElementById("img_cartes");
var cartes = []; // tableaux d'images des cartes
var banque = []; // les cartes à piocher
var pot,
    potCanvas = document.getElementById("pot"); // la carte
var nbBots = 1; // liste des mains des bots
var joueur,
    bots = [];

var pique = false;
var botJoue = false;


// l'objet joueur
var joueurObj = function(is_human) {
    this.is_human = is_human;
    this.main = [];
    this.joue = function(carte) {
        if(this.is_human && this.main.length === 0) {
            botJoue = false;
        }

        if(is_human) {
            botJoue = false;

            if(!joueurPeutJouer()) {
                botJoue = true;
                this.main.push(banque.pop());
                return null;
            }

            if(pot[0] === 7 && pique ) {
                botJoue = true;
                this.main.push(banque.pop());
                this.main.push(banque.pop());
                pique = false;
                return null;
            }
            
            if(carte[0] === pot[0] || carte[1] === pot[1]) {
                banque.push(pot);
                pot = carte;
                this.main.splice(this.main.indexOf(carte), 1);
                if(pot[0] === 7) {
                    pique = true;
                }
                botJoue = true;
                return null;
            }
            else {
                console.log("mauvaise carte");
                return null
            }
        }
        else if(botJoue) {

            if(this.main.length === 0){
                return null;
            }
    
            if(pot[0] === 7 && pique ) {
                this.main.push(banque.pop());
                this.main.push(banque.pop());
                pique = false;
                console.log(this.main);
                return null;
            }
            
            for (let i = 0; i < this.main.length; i++) {
                var c = this.main[i];
    
                if(c[0] === pot[0] || c[1] === pot[1]) {
                    banque.push(pot);
                    pot = c;
                    this.main.splice(i, 1);
                    if(pot[0] === 7) {
                        pique = true;
                    }
                    console.log(this.main);
                    return null;
                }
                
            }
    
            this.main.push(banque.pop());
            console.log(this.main);
            return null;

        }

    }
}

function initCards() {
    
    for (let j = 0; j < 4; j++) {
        for (let i= 0; i < 13; i++) {
            cartes.push([i, j])
        }
    }
}
function setCardImg(coords) {
    //prends des coordonnées en 2d et retourne une couleur associée
    return "rgb("+(coords[0]%255)+"+,0,"+(coords[1]%255)+")";
}


function melanger(tas) {
    // prends un tas de carte et retourne un tas mélangé
    var array = tas;

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

  return array;
    
}

function effacer_main() {
    var element = document.getElementsByTagName("canvas"), index;

    for (index = element.length - 1; index >= 0; index--) {
        if(element[index].id !=="pot"){
            element[index].parentNode.removeChild(element[index]);
        }
    }
}

function joueurPeutJouer() {
    for (let i = 0; i < joueur.main.length; i++) {
        var carte = joueur.main[i];
        if(pot[0] === carte[0] || pot[1] === carte[1]) {
            return true;
        }
    }
    return false;
}

function dessiner_pot() {
    var ctx = potCanvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, potCanvas.width, potCanvas.height);
    ctx.fillText(""+pot, 50/2-5, 100/2-5);
}

function joueurPerd() {
    for (let i = 0; i < bots.length; i++) {
        if(bots[i].main.length !== 0) {
            return false;
        }
        return true;
    }
}

function afficher_main(main) {
    var x = 0,
        y = 120,
        width = cartesWidth,
        height = cartesHeight;
    
    effacer_main();

    main.forEach(carte => {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.id = ""+(carte);
        canvas.style.position = "absolute";
        canvas.style.top = y+"px";
        canvas.style.left = x+"px";

        canvas.onclick = function() {
            joueur.joue(carte);
            for (let i = 0; i < bots.length; i++) {
                bots[i].joue(carte);
            }

            afficher_main(joueur.main);
            dessiner_pot();

            for (let i = 0; i < bots.length; i++) {
                afficher_main_bot(bots[i].main.length, 2*cartesHeight + i*cartesHeight + 30);
            }

            banque = melanger(banque); 

            if(joueur.main.length === 0) {
                alert("gagné !");
            }

            if(joueurPerd()) {
                alert("perdu !");
            }
        }

        var ctx = canvas.getContext('2d');
        ctx.beginPath()
        ctx.fillText(""+carte, width/2-5, height/2-5);

        body.appendChild(canvas);

        x+=cartesWidth + 5;
    });
    
}

function afficher_main_bot (nb, yc) {
    var x = 0,
        y = yc,
        width = cartesWidth,
        height = cartesHeight;
    
    for (let i = 0; i < nb; i++) {
        

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = "absolute";
        canvas.style.top = y+"px";
        canvas.style.left = x+"px";

        var ctx = canvas.getContext('2d');
        ctx.beginPath()
        ctx.fillText("bot", width/2-5, height/2-5);

        body.appendChild(canvas);

        x+=cartesWidth + 5;
        
    }    


}



function main() {
    //initialisation des cartes
    initCards();
    banque = cartes; // initialement la banque contient toutes les cartes

    banque = melanger(banque); 

    // initialisation es joueurs
    joueur = new joueurObj(true);
    for (let i = 0; i < nbBots; i++) {
        bots.push(new joueurObj(false));   
    }

    // distribution des cartes
    joueur.main = banque.slice(banque.length - 4)
    banque.splice(banque.length - 4, 4);
    for (let i = 0; i < nbBots; i++) {
        bots[i].main = banque.slice(banque.length - 4)
        banque.splice(banque.length - 4, 4); 
    }

    //initialisation du pot
    pot = banque[banque.length -1];

    //affichage de la main du joueur
    afficher_main(joueur.main);
    dessiner_pot();
    for (let i = 0; i < bots.length; i++) {
        afficher_main_bot(bots[i].main.length, 2*cartesHeight + i*cartesHeight + 30);
    }

}

main();