let deck = [];
let p = [
	{ name: 'bottom', hand: [], playing: '', eaten: [] },
	{ name: 'right', hand: [], playing: '', score: [] },
	{ name: 'top', hand: [], playing: '', score: [] },
	{ name: 'left', hand: [], playing: '', score: [] },
];

let topDiv = document.getElementById('pTDiv');
let bottomDiv = document.getElementById('pBDiv');
let leftDiv = document.getElementById('pLDiv');
let rightDiv = document.getElementById('pRDiv');

let bottomPlayDiv = document.getElementById('playerArea');
let rightPlayDiv = document.getElementById('rightArea');
let topPlayDiv = document.getElementById('topArea');
let leftPlayDiv = document.getElementById('leftArea');

let bScore = document.getElementById('bScore');
let rScore = document.getElementById('rScore');
let tScore = document.getElementById('tScore');
let lScore = document.getElementById('lScore');

let winner = document.getElementById('winner');

let buNew = document.getElementById('buNew');
let bu = document.getElementById('bu');
let buCheat = document.getElementById('buCheat');

let turn = 0, family = "any", round = 1, pCI = "",next=false;
;

let status = document.querySelector('#a');

status.innerHTML = 'waiting..';
leftDiv.style.display = "none";
rightDiv.style.display = "none";
topDiv.style.display = "none";
bu.disabled = true;
console.clear();
newGame();
sort();
checkSevenOfHeart();
uiRef();

starGame();
function canPlayerClick(boo) {
	function playCardOnClick() {
		pCI = p[0].hand.findIndex(x => x.pic == this.src.split("/").pop().split('.').shift());
		console.log(p[0].hand[pCI]);

	}
	if (boo)
		bottomDiv.querySelectorAll("img").forEach(element => { 
			if(	element.src.split("/").pop().split('.').shift().includes(family)||
				family==="any"||
				(function() {
					var i = p[0].hand.length;
					while (i--) {
					   if (p[0].hand[i].pic.includes(family)) {
						   return false;
					   }
					}
					return true;
				})()
				)
			{element.onclick = playCardOnClick;
			 element.className="iimg";	}
			 });
	else
		bottomDiv.querySelectorAll("img").forEach(element => { element.onclick = "";element.className=""; });
}




async function starGame() {




	for (round; round <= 13; round++) {
		console.log(turnOrder(turn));
		let x = turnOrder(turn);
		for (turn of x) {

			if (turn === 0) {
				//TODO: player play
				canPlayerClick(true);
				const waitForPlayer = new Promise((r, j) => {
					var check = () => {
						if (pCI !== "")
							r(pCI)

						else
							setTimeout(check, 500)
					}
					setTimeout(check, 500)
				});

				status.innerHTML = "wating for player";
				
				let cardIndex = await waitForPlayer;
				canPlayerClick(false);
				pCI = cardIndex;

			} else {
				//TODO: ai play
				pCI = aiPlay(p[turn].hand,family);
			}
			// pCI=0; //FIXME: delete for player input
			
			
			playCard(turn, pCI);
			console.log(turn + ' turn ,played ' + p[turn].playing.name,"family is  "+family);

			
			if (family==="any"){ 
				family=p[turn].playing.pic.slice(-1);
				}

			turn++;
			if (turn > 3) { turn = 0; }
			pCI = "";
			uiRef();

			//-------------------------------------------------------//
		}
		//TODO: let turn = who eat lu6sh
		let lutch = [p[0].playing,p[1].playing,p[2].playing,p[3].playing];
		let r=[];
		console.log(lutch);
		for(let i = 0; i < 4; i++){
			if (lutch[i].pic.includes(family)){
				r.push(lutch[i]);
			}
		}
		r = r.sort((a,b)=>b.value-a.value);
		console.log(r);
		for (let i = 0; i < 4; i++) {
			if(r[0]===p[i].playing){
				turn = i;
			}
			
		}
		
		p[turn].score += p[0].playing.comp + p[1].playing.comp +
		p[2].playing.comp + p[3].playing.comp - 15;
		p[turn].eaten.push(p[0].playing, p[1].playing, p[2].playing, p[3].playing);

		family="any";

		uiRef();
		const waitForNext = new Promise((r, j) => {
			bu.disabled=false;
			switch(turn){
				case 0 : bottomPlayDiv.className="flashit"; break;
				case 1 : rightPlayDiv.className="flashit"; break;
				case 2 : topPlayDiv.className="flashit"; break;
				case 3 : leftPlayDiv.className="flashit"; break;
			}
			bu.className="flash-button";
			status.innerHTML=  p[turn].name + '   turn   ---score:' + p[turn].score;
			var check = () => {
				if (next)
					r(!next)
				else
					setTimeout(check, 500)
			}
			setTimeout(check, 500)
		});
		next = await waitForNext;
		bu.disabled=true;
		bu.className="";
		bottomPlayDiv.className="";
		rightPlayDiv.className="";
		topPlayDiv.className="";
		leftPlayDiv.className="";	
		p[0].playing="";
		p[1].playing="";
		p[2].playing="";
		p[3].playing="";
		uiRef();
		bScore.innerHTML="=> player score  is : " + p[0].score;
		rScore.innerHTML="=> right  score  is : " + p[1].score;
		tScore.innerHTML="=> top    score  is : " + p[2].score;
		lScore.innerHTML="=> left   score  is : " + p[3].score;
		
		console.log('new turn is ' + turn + ' ---score:' + p[turn].score);

	}
	console.log("\ngame ended",
		"\nplayer score: " + p[0].score,
		"\nright score: " + p[1].score,
		"\ntop score: " + p[2].score,
		"\nleft score: " + p[3].score);
	// let winnerS = [p[0].score,p[1].score,p[2].score,p[3].score];
	// winnerS.sort((a,b)=>b-a);
	p.sort((a,b)=>b.score-a.score);
	winner.innerHTML="The winner is " + p[0].name;
	status.innerHTML="game has ended";
	buNew.disabled=false;
	buNew.className="flash-button";

}

function turnOrder(turn) {
	switch (turn) {
		case 0: return [0, 1, 2, 3];
		case 1: return [1, 2, 3, 0];
		case 2: return [2, 3, 0, 1];
		case 3: return [3, 0, 1, 2];
	}
}

function aiPlay(aiHand,fm) {
	console.log('aiPlay function start');
	let s = [], h = [], d = [], c = [];
		aiHand.forEach(element => {
		switch (true) {
			case element.name.includes("Spades"):
				s.push(element);
				break;
			case element.name.includes("Hearts"):
				h.push(element);
				break;
			case element.name.includes("Diamonds"):
				d.push(element);
				break;
			case element.name.includes("Clubs"):
				c.push(element);
				break;

		}

	});
	switch (true) {
		case s.length > 0 && fm==="S":
			return aiHand.findIndex(x => x.name === s[0].name);
		case h.length > 0 && fm==="H":
			return aiHand.findIndex(x => x.name === h[0].name);
		case d.length > 0 && fm==="D":
			return aiHand.findIndex(x => x.name === d[0].name);
		case c.length > 0 && fm==="C":
			return aiHand.findIndex(x => x.name === c[0].name);
		default :
			return Math.floor(Math.random() * aiHand.length);;
	}
	console.log('aiHand', aiHand);
	// console.log(aiHand,s,h,d,c,"\n aiPlay function end");	
}

function playCard(pI, cI) {
	p[pI].playing = p[pI].hand.splice(cI, 1)[0];
}

function sort() {
	for (i = 0; i < p.length; i++) {
		p[i].hand.sort(function (a, b) {
			return b.order - a.order;
		});
	}
}

function drawCard(fromArr, toArr) {
	toArr.push(fromArr.shift())
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

function checkSevenOfHeart() {
	//search fo 7ofheart
	//let turn for 7 of heart 
	switch (true) {
		case p[0].hand.findIndex(x => x.pic == '7H') >= 0:
			turn = 0;//player
			break;
		case p[2].hand.findIndex(x => x.pic == '7H') >= 0:
			turn = 2;//top
			break;
		case p[3].hand.findIndex(x => x.pic == '7H') >= 0:
			turn = 3;//left
			break;
		case p[1].hand.findIndex(x => x.pic == '7H') >= 0:
			turn = 1;//right
			break;

	}
	console.log("7 of heart with ///" + p[turn].name + "///");
}


function uiRef() {
	function imgArrRef(arr, div) {
		for (i = 0; i < arr.length; i++) {
			let cardImg = document.createElement("img");
			cardImg.src = 'cardsPictures/' + arr[i].pic+'.png';
			cardImg.setAttribute("width", "70");
			div.appendChild(cardImg);
		}
	}
	function imgRef(cardObj, div) {
		if (cardObj !== "") {
			let cardImg = document.createElement("img");
			cardImg.src = 'cardsPictures/' + cardObj.pic+'.png';
			cardImg.setAttribute("width", "70");
			div.appendChild(cardImg);
		}
	}

	topDiv.innerHTML = "";
	bottomDiv.innerHTML = "";
	leftDiv.innerHTML = "";
	rightDiv.innerHTML = "";
	bottomPlayDiv.innerHTML = "";
	rightPlayDiv.innerHTML = "";
	topPlayDiv.innerHTML = "";
	leftPlayDiv.innerHTML = "";

	imgArrRef(p[0].hand, bottomDiv);
	imgArrRef(p[1].hand, rightDiv);
	imgArrRef(p[2].hand, topDiv);
	imgArrRef(p[3].hand, leftDiv);

	imgRef(p[0].playing, bottomPlayDiv);
	imgRef(p[1].playing, rightPlayDiv);
	imgRef(p[2].playing, topPlayDiv);
	imgRef(p[3].playing, leftPlayDiv);
}
function newGame() {
	buNew.disabled=true;
	buNew.className="";
	topDiv.innerHTML = "";
	bottomDiv.innerHTML = "";
	leftDiv.innerHTML = "";
	rightDiv.innerHTML = "";
	winner.innerHTML=""

	bScore.innerHTML="=> player score  is : " ;
	rScore.innerHTML="=> right  score  is : " ;
	tScore.innerHTML="=> top    score  is : " ;
	lScore.innerHTML="=> left   score  is : " ;
	winner,innerHTML ="=>";

	turn = 0, family = "any", pCI = "",next=false;
	deck = [], round = 1;
	p = [
		{ name: 'bottom', hand: [], playing: '', eaten: [], score: 0, },
		{ name: 'right', hand: [], playing: '', eaten: [], score: 0, },
		{ name: 'top', hand: [], playing: '', eaten: [], score: 0, },
		{ name: 'left', hand: [], playing: '', eaten: [], score: 0, },
	];

	deck = 
	[{ name: "King of Hearts", value: 13, pic: "KH", order: 2, comp: -75, du: 150 },
	{ name: "Qween of Hearts", value: 12, pic: "QH", order: 3, comp: -25, du: 50 },
	{ name: "jack of Hearts", value: 11, pic: "JH", order: 4, comp: 0, },
	{ name: "Ace of Hearts", value: 14, pic: "AH", order: 1, comp: 0, },
	{ name: "Two of Hearts", value: 2, pic: "2H", order: 13, comp: 0, },
	{ name: "Three of Hearts", value: 3, pic: "3H", order: 12, comp: 0, },
	{ name: "Four of Hearts", value: 4, pic: "4H", order: 11, comp: 0, },
	{ name: "Five of Hearts", value: 5, pic: "5H", order: 10, comp: 0, },
	{ name: "Six of Hearts", value: 6, pic: "6H", order: 9, comp: 0, },
	{ name: "Seven of Hearts", value: 7, pic: "7H", order: 8, comp: 0, },
	{ name: "Eight of Hearts", value: 8, pic: "8H", order: 7, comp: 0, },
	{ name: "Nine of Hearts", value: 9, pic: "9H", order: 6, comp: 0, },
	{ name: "Ten of Hearts", value: 10, pic: "10H", order: 5, comp: 0, },

	{ name: "King of Diamonds", value: 13, pic: "KD", order: 28, comp: -10, },
	{ name: "Qween of Diamonds", value: 12, pic: "QD", order: 29, comp: -35, du: 60 },
	{ name: "jack of Diamonds", value: 11, pic: "JD", order: 30, comp: -10, },
	{ name: "Ace of Diamonds", value: 14, pic: "AD", order: 27, comp: -10, },
	{ name: "Two of Diamonds", value: 2, pic: "2D", order: 39, comp: -10, },
	{ name: "Three of Diamonds", value: 3, pic: "3D", order: 38, comp: -10, },
	{ name: "Four of Diamonds", value: 4, pic: "4D", order: 37, comp: -10, },
	{ name: "Five of Diamonds", value: 5, pic: "5D", order: 36, comp: -10, },
	{ name: "Six of Diamonds", value: 6, pic: "6D", order: 35, comp: -10, },
	{ name: "Seven of Diamonds", value: 7, pic: "7D", order: 34, comp: -10, },
	{ name: "Eight of Diamonds", value: 8, pic: "8D", order: 33, comp: -10, },
	{ name: "Nine of Diamonds", value: 9, pic: "9D", order: 32, comp: -10, },
	{ name: "Ten of Diamonds", value: 10, pic: "10D", order: 31, comp: -10, },

	{ name: "King of Spades", value: 13, pic: "KS", order: 15, comp: 0, },
	{ name: "Qween of Spades", value: 12, pic: "QS", order: 16, comp: -25, du: 50 },
	{ name: "jack of Spades", value: 11, pic: "JS", order: 17, comp: 0, },
	{ name: "Ace of Spades", value: 14, pic: "AS", order: 14, comp: 0, },
	{ name: "Two of Spades", value: 2, pic: "2S", order: 26, comp: 0, },
	{ name: "Three of Spades", value: 3, pic: "3S", order: 25, comp: 0, },
	{ name: "Four of Spades", value: 4, pic: "4S", order: 24, comp: 0, },
	{ name: "Five of Spades", value: 5, pic: "5S", order: 23, comp: 0, },
	{ name: "Six of Spades", value: 6, pic: "6S", order: 22, comp: 0, },
	{ name: "Seven of Spades", value: 7, pic: "7S", order: 21, comp: 0, },
	{ name: "Eight of Spades", value: 8, pic: "8S", order: 20, comp: 0, },
	{ name: "Nine of Spades", value: 9, pic: "9S", order: 19, comp: 0, },
	{ name: "Ten of Spades", value: 10, pic: "10S", order: 18, comp: 0, },

	{ name: "King of Clubs", value: 13, pic: "KC", order: 41, comp: 0, },
	{ name: "Qween of Clubs", value: 12, pic: "QC", order: 42, comp: -25, du: 50 },
	{ name: "jack of Clubs", value: 11, pic: "JC", order: 43, comp: 0, },
	{ name: "Ace of Clubs", value: 14, pic: "AC", order: 40, comp: 0, },
	{ name: "Two of Clubs", value: 2, pic: "2C", order: 52, comp: 0, },
	{ name: "Three of Clubs", value: 3, pic: "3C", order: 51, comp: 0, },
	{ name: "Four of Clubs", value: 4, pic: "4C", order: 50, comp: 0, },
	{ name: "Five of Clubs", value: 5, pic: "5C", order: 49, comp: 0, },
	{ name: "Six of Clubs", value: 6, pic: "6C", order: 48, comp: 0, },
	{ name: "Seven of Clubs", value: 7, pic: "7C", order: 47, comp: 0, },
	{ name: "Eight of Clubs", value: 8, pic: "8C", order: 46, comp: 0, },
	{ name: "Nine of Clubs", value: 9, pic: "9C", order: 45, comp: 0, },
	{ name: "Ten of Clubs", value: 10, pic: "10C", order: 44, comp: 0, },]

	shuffle(deck);
	for (var i = 0; i < 13; i++) {
		drawCard(deck, p[1].hand);
		drawCard(deck, p[2].hand);
		drawCard(deck, p[3].hand);
		drawCard(deck, p[0].hand);
	}

}

bu.addEventListener('click', function () {
	next = true;
});

buNew.addEventListener('click',function(){
newGame();
sort();
checkSevenOfHeart();
uiRef();
starGame();
});
buCheat.addEventListener('click', function () {
	if (leftDiv.style.display === "none") {
		leftDiv.style.display = "block";
		rightDiv.style.display = "block";
		topDiv.style.display = "block";
	} else {
		leftDiv.style.display = "none";
		rightDiv.style.display = "none";
		topDiv.style.display = "none";
	}
});
console.log("-------------------------------------------------------");