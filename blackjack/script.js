
let deck=[];
let playerHand=[];
let cpuHand=[];
let playerScore=0,cpuScore=0;

let playerLi = document.getElementById('playerHand');
let cpuLi = document.getElementById('cpuHand');

let playerScoreTx = document.getElementById('playerScore');
let cpuScoreTx = document.getElementById('cpuScore');

let hitBu = document.getElementById('hitButton');
let standBu = document.getElementById('standButton');
let newGameBu = document.getElementById('newButton');
let logText = document.getElementById('logTxt');

let isPlayerWon = false, isGameOver=false,isPlayerStand=false;


newGame();
sartGame();




hitBu.addEventListener('click',function(){
drawCard(deck,playerHand);
check();
if (!isGameOver) {
	drawCard(deck,cpuHand);
	check();
}
});

standBu.addEventListener('click',function(){
	isPlayerStand=true;
	hitBu.disabled=true;
	standBu.disabled=true;
if (playerScore>cpuScore) {
	while(playerScore>cpuScore){drawCard(deck,cpuHand);
	}}
	check();
});

newGameBu.addEventListener('click',function(){
	newGame();
	sartGame();
	hitBu.disabled = false;
 	standBu.disabled = false;
});



function drawCard(fromArr ,toArr ) {
	toArr.push(fromArr.shift())
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(toArr[toArr.length-1].name));
	if ( toArr==playerHand)
		{	playerLi.appendChild(li);
			playerScore += playerHand[playerHand.length-1].value;
			playerScoreTx.innerHTML = "your score is "+ playerScore;
			let cardImg = document.createElement("img");
			cardImg.src='cardsPictures/'+playerHand[playerHand.length-1].pic;
			cardImg.setAttribute("width","100")
			document.getElementById("pImgBox").appendChild(cardImg);
		} 
	else
	 	{	cpuLi.appendChild(li);
	 		cpuScore += cpuHand[cpuHand.length-1].value;
			cpuScoreTx.innerHTML = "your score is "+ cpuScore;
			let cardImg = document.createElement("img");
			cardImg.src='cardsPictures/'+cpuHand[cpuHand.length-1].pic;
			cardImg.setAttribute("width","100")
			document.getElementById("cImgBox").appendChild(cardImg);
	 	}
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function check(){
 	switch (true){
 		case playerScore==21&&cpuScore==21 :
 			logText.innerHTML='its a blackjack draw';
 			isGameOver=true;
 			break;
 		case playerScore==cpuScore :
 			logText.innerHTML='its a  draw';
 			isGameOver=true;
 			break;
 		case playerScore==21 :
 			logText.innerHTML='blackjack player win';
 			isGameOver=true;
 			break;
 		case cpuScore==21 :
 			logText.innerHTML='BlackJack cpu win';
 			isGameOver=true;
 			break;
 		case playerScore>21 :
 			logText.innerHTML='you lose';
 			isGameOver=true;
 			break;
 		case cpuScore>21 : 
 			logText.innerHTML='you win';
 			isGameOver=true;
 			break;
 		default :
 			logText.innerHTML='your turn';
 	}
 	if (isPlayerStand) {
 		if (playerScore<cpuScore&&cpuScore<21) {
 			isGameOver=true;
 			logText.innerHTML='you lose';
 		}
 	}
 	if (isGameOver) {
 		hitBu.disabled=true;
 		standBu.disabled=true;
 	}
}
function sartGame(){
shuffle(deck);
drawCard(deck,playerHand);
drawCard(deck,playerHand);
drawCard(deck,cpuHand);
drawCard(deck,cpuHand);
check();
}

function ai(){
	switch(true){
		case playerScore>cpuScore:
			drawCard(deck,cpuHand);
			check();
			break;
		case cpuScore>16&&cpuScore>playerScore:
			check();
			break;
		case isPlayerStand :
			if (cpuScore>playerScore) {check();}else{drawCard(deck,cpuHand);}
		default :
			drawCard(deck,cpuHand);
			check();
		}
}


function newGame(){
	document.getElementById('pImgBox').innerHTML = "";
	document.getElementById('cImgBox').innerHTML = "";
	isGameOver=false;
	isPlayerStand=false;
	playerScore=0;
	cpuScore=0;
	playerHand=[];
 	cpuHand=[];
 	playerLi.innerHTML="";
 	cpuLi.innerHTML="";
 	deck= [	{ name : "King of Hearts" ,value : 10,pic : "KH.png", }, 
		 	{ name : "Qween of Hearts",value : 10,pic : "QH.png", },
		 	{ name : "jack of Hearts" ,value : 10,pic : "JH.png", },
		 	{ name : "Ace of Hearts"  ,value : 11,pic : "AH.png", },
		 	{ name : "Two of Hearts"  ,value : 2 ,pic : "2H.png", },
		 	{ name : "Three of Hearts",value : 3 ,pic : "3H.png", },
		 	{ name : "Four of Hearts" ,value : 4 ,pic : "4H.png", },
		 	{ name : "Five of Hearts" ,value : 5 ,pic : "5H.png", },
		 	{ name : "Six of Hearts"  ,value : 6 ,pic : "6H.png", },
		 	{ name : "Seven of Hearts",value : 7 ,pic : "7H.png", },
		 	{ name : "Eight of Hearts",value : 8 ,pic : "8H.png", },
			{ name : "Nine of Hearts" ,value : 9 ,pic : "9H.png", },
		 	{ name : "Ten of Hearts"  ,value : 10,pic : "10H.png",},

			{ name : "King of Diamonds" ,value : 10,pic : "KD.png",}, 
		 	{ name : "Qween of Diamonds",value : 10,pic : "QD.png",},
		 	{ name : "jack of Diamonds" ,value : 10,pic : "JD.png",},
		 	{ name : "Ace of Diamonds"  ,value : 11,pic : "AD.png",},
		 	{ name : "Two of Diamonds"  ,value : 2 ,pic : "2D.png",},
		 	{ name : "Three of Diamonds",value : 3 ,pic : "3D.png",},
		 	{ name : "Four of Diamonds" ,value : 4 ,pic : "4D.png",},
		 	{ name : "Five of Diamonds" ,value : 5 ,pic : "5D.png",},
		 	{ name : "Six of Diamonds"  ,value : 6 ,pic : "6D.png",},
		 	{ name : "Seven of Diamonds",value : 7 ,pic : "7D.png",},
		 	{ name : "Eight of Diamonds",value : 8 ,pic : "8D.png",},
		 	{ name : "Nine of Diamonds" ,value : 9 ,pic : "9D.png",},
		 	{ name : "Ten of Diamonds"  ,value : 10,pic : "10D.png",},

		 	{ name : "King of Spades" ,value : 10,pic : "KS.png",}, 
		 	{ name : "Qween of Spades",value : 10,pic : "QS.png",},
		 	{ name : "jack of Spades" ,value : 10,pic : "JS.png",},
		 	{ name : "Ace of Spades"  ,value : 11,pic : "AS.png",},
		 	{ name : "Two of Spades"  ,value : 2 ,pic : "2S.png",},
		 	{ name : "Three of Spades",value : 3 ,pic : "3S.png",},
		 	{ name : "Four of Spades" ,value : 4 ,pic : "4S.png",},
		 	{ name : "Five of Spades" ,value : 5 ,pic : "5S.png",},
		 	{ name : "Six of Spades"  ,value : 6 ,pic : "6S.png",},
		 	{ name : "Seven of Spades",value : 7 ,pic : "7S.png",},
		 	{ name : "Eight of Spades",value : 8 ,pic : "8S.png",},
		 	{ name : "Nine of Spades" ,value : 9 ,pic : "9S.png",},
		 	{ name : "Ten of hearts"  ,value : 10,pic : "10D.png",},

		 	{ name : "King of Clubs" ,value : 10,pic : "KC.png",}, 
		 	{ name : "Qween of Clubs",value : 10,pic : "QC.png",},
		 	{ name : "jack of Clubs" ,value : 10,pic : "JC.png",},
		 	{ name : "Ace of Clubs"  ,value : 11,pic : "AC.png",},
		 	{ name : "Two of Clubs"  ,value : 2 ,pic : "2C.png",},
		 	{ name : "Three of Clubs",value : 3 ,pic : "3C.png",},
		 	{ name : "Four of Clubs" ,value : 4 ,pic : "4C.png",},
		 	{ name : "Five of Clubs" ,value : 5 ,pic : "5C.png",},
			{ name : "Six of Clubs"  ,value : 6 ,pic : "6C.png",},
		 	{ name : "Seven of Clubs",value : 7 ,pic : "7C.png",},
		 	{ name : "Eight of Clubs",value : 8 ,pic : "8C.png",},
		 	{ name : "Nine of Clubs" ,value : 9 ,pic : "9C.png",},
		 	{ name : "Ten of Clubs"  ,value : 10,pic : "10C.png",},]
 	}
