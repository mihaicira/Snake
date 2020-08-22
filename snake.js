/*DIFFICULTY*/
var speed = 1.2;
var bonusduration = 40;
var bonusfrequency = 5; // cu cat e mai mic, cu atat e mai des
var eventfrequency = 15;
var cheat = 0;
/*DO NOT CHANGE*/
var head = [0,0]; //head coordonates
var units = 0;//numer of squares that head has been on
var started = 0; //1 as soon as snake started moving first time
var size = 22; // size of play area
var bonus = 0; // active or not
var active_food = 0; // food that has not been eaten yet
var bonuses = 0; // how many bonuses
var tummycoord = [[head[0],head[1]]]; //corrdonates of tummy
var snakesize = 1; // 
var direction;
var event = 0;
var events = 0;
var snakesizewheneventoccured;
function element(i,j)
{
	a = document.getElementById('table').children[i].children[j].children[0];
	return a;
}


var matrix = [];
for(var i=0;i<size;i++){
	matrix.push([]);
	for(var j=0;j<size;j++)
		matrix[i].push({
	stable: 	1,
	food: 		0,
	eventt:  	0,
	bonus:  	0
} );
}

for(var i=0 ; i<size ; i++)
{
	matrix[0][i].stable = 0;
	element(0,i).style.backgroundColor="black";

	matrix[size-1][i].stable = 0;
	element(size-1,i).style.backgroundColor="black";

	matrix[i][0].stable = 0;
	element(i,0).style.backgroundColor="black";

	matrix[i][size-1].stable = 0;
	element(i,size-1).style.backgroundColor="black";
}

/*


TEST LOUNGE

*/
function rnd() {
	var min = 1;
	var max = size-1;
  return Math.floor(Math.random() * (max - min)) + min;
}

function createhead()
{
	var i = rnd();
	var j = rnd();

	head[0] = i;
	head[1] = j;

	element(i,j).classList.add('head');

	if(i<=size/2 && j<=size/2)
		direction = "D";
	else if(i<=size/2 && j>=size/2)
		direction = "S";
	else if(i>=size/2 && j<=size/2)
		direction = "W";
	else if(i>=size/2 && j>=size/2)
		direction = "A";
}
createhead();

function createbonus()
{
	var i = rnd();
	var j = rnd();
	if(matrix[i][j].stable == 0 || matrix[i][j].food == 1 || matrix[i][j].eventt == 1 || (head[0]==i && head[1]==j) || element(i,j).classList[0] =="body")
		createbonus();
	else{
		matrix[i][j].bonus = 1;
		element(i,j).classList.add('bonus');
	}
	bonuses++;
}
/**/

function createvent()
{
	var i = rnd();
	var j = rnd();
	if(matrix[i][j].stable == 0 || matrix[i][j].food == 1 || matrix[i][j].bonus == 1 || (head[0]==i && head[1]==j) || element(i,j).classList[0] =="body")
		createvent();
	else{
		matrix[i][j].eventt = 1;
		element(i,j).classList.add('event');
	}
	events = 1;
}

/****/
function createfood()
{
	var i = rnd();
	var j = rnd();
	if(matrix[i][j].stable == 0 || matrix[i][j].bonus == 1  || matrix[i][j].eventt == 1|| (head[0]==i && head[1]==j) || element(i,j).classList[0] =="body")
		createfood();
	else{
	matrix[i][j].food = 1;
	element(i,j).classList.add('food');
	active_food++;
	}
}

function eating(i,j)
{
	snakesize++;

	tummycoord.push([lastplace[0],lastplace[1]]);

	element(lastplace[0],lastplace[1]).classList.add('body');
	matrix[lastplace[0]][lastplace[1]].stable = 0;

	element(i,j).classList.remove('food');
	matrix[i][j].food = 0;

	active_food--;
	if(active_food == 0)
		createfood();
}


var lastplace = [0,0];
var bonustimer = 1;
var snakesizewhenbonusoccured = 0;
var stop = 0;

function headchange(newi,newj)
{	

	if(snakesize == 1){

		lastplace[0] = head[0];
		lastplace[1] = head[1];
	}

	if(matrix[newi][newj].stable == 0)
		{
			element(head[0],head[1]).style.backgroundImage= "url('dead.png')";

			stop = 1;
			direction = 'STOP';
			if(snakesize==1)
				document.getElementById("score").innerHTML = "Scor: 0. Nasol bro!";
			else
				document.getElementById("score").innerHTML = "Scor: " + (snakesize-1);
			document.getElementById("units").innerHTML = "Unitati parcurse: " + units;

			//alert('SNAKE IS DEAD');

			return;
		}


	element(tummycoord[0][0],tummycoord[0][1]).classList.remove('eating');
	

	if(snakesize > 1)
	{
		element(head[0],head[1]).classList.add('body');
		matrix[head[0]][head[1]].stable = 0;
		lastplace[0] = tummycoord[snakesize-1][0];
		lastplace[1] = tummycoord[snakesize-1][1];
		for(var i=snakesize-1 ; i>=1 ; i--)
			{	
				tummycoord[i][0] = tummycoord[i-1][0];
				tummycoord[i][1] = tummycoord[i-1][1];
			}

		element(lastplace[0],lastplace[1]).classList.remove('body');
		matrix[lastplace[0]][lastplace[1]].stable = 1;

	}

	if(matrix[newi][newj].food == 1)
	{
		element(newi,newj).classList.add('eating');
		eating(newi,newj);
	}

	if(matrix[newi][newj].bonus == 1)
	{
		bonus = 1;
		matrix[newi][newj].bonus = 0;
		element(newi,newj).classList.remove('bonus');
		bonuses = 0;
		speed = 1.7;
	}

	if(bonus == 1)
	{	
		if(bonustimer%bonusduration == 0)
		{
			speed=1.2;
			bonus=0;
			bonustimer = 0;
		}
			bonustimer++;

	}

	if((snakesize-1)%bonusfrequency == 0 && bonus == 0 && bonuses == 0 && snakesize-1>bonusfrequency-1 && snakesizewhenbonusoccured != snakesize-1)
		{
			snakesizewhenbonusoccured = snakesize-1;
			createbonus();
		}

	
	
	if(matrix[newi][newj].eventt == 1)
	{
		event = 1;//**//
		bonuses = 1;
		element(newi,newj).classList.remove('event');
		matrix[newi][newj].eventt = 0;
		events = 0;
		for(var i=1;i<=11;i++)
			createfood();
	}
	console.log((snakesize-1)%eventfrequency);
	if((snakesize-1)%eventfrequency == 0 && event == 0 && events == 0 && snakesize-1 > eventfrequency-1 && snakesizewheneventoccured != snakesize-1)
	{
		snakesizewheneventoccured = snakesize-1;
		eventfrequency = 45; // initially: 15; after first event: 45
		createvent();
	}
	if(active_food < 2 && event == 1)
	{
		bonuses = 0;
		event = 0;
	}
	/**/

	element(head[0],head[1]).classList.remove('head');
	if(snakesize == 1)
		matrix[head[0]][head[1]].stable = 1;
	element(newi,newj).classList.add('head');
	matrix[newi][newj].stable = 0;
	
	
	head[0] = newi;
	head[1] = newj;
	tummycoord[0][0] = head[0];
	tummycoord[0][1] = head[1];

	units++;

}


createfood();

function go()
{	
	if(direction == "W" && stop == 0)
		headchange(head[0]-1,head[1]);

	if(direction == "A" && stop == 0)
		headchange(head[0],head[1]-1);

	if(direction == "S" && stop == 0)
		headchange(head[0]+1,head[1]);

	if(direction == "D" && stop == 0)
		headchange(head[0],head[1]+1);

	if(direction != 'P')
		setTimeout(go,150*(1/speed));
}
var lastdirection;
var pause = document.body.children[1];
var startcvr = document.body.children[2];
document.onkeydown = function(event){
	switch(event.keyCode){
		case 13:
		if(started == 0)
			{
			go();
			started = 1;
			startcvr.style.zIndex = '-1';
			}
		else if(direction == 'P')
		{
			pause.style.zIndex='-1';
			direction = lastdirection;
			go();
		}
		break;

		case 80:
		pause.style.zIndex='2';
		lastdirection = direction;
		direction = 'P';
		break;

		case 37:
		if(direction != 'D' && direction !='P')
		direction = 'A';
		break;

		case 38:
		if(direction != 'S' && direction !='P')
		direction = 'W';
		break;

		case 39:
		if(direction != 'A' && direction !='P')
		direction = 'D';
		break;

		case 40:
		if(direction != 'W' && direction !='P')
		direction = 'S';
		break;
	}
}