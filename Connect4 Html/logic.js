var maxRows = 6;
var maxColumns = 7;
var currentTurn = 0;
var playerColor = ["blue","red"];
var playerHighlight = ["lightblue", "#FF6666"];
var playerName = [];
var matrix = [[0, 0, 0, 0, 0, 0, 0], 
		  [0, 0, 0, 0, 0, 0, 0], 
		  [0, 0, 0, 0, 0, 0, 0], 
		  [0, 0, 0, 0, 0, 0, 0], 
		  [0, 0, 0, 0, 0, 0, 0], 
		  [0, 0, 0, 0, 0, 0, 0]];
var playerScore = [0, 0];

function checkWinner(row, column){
	return (checkHorizontal(row, column) || checkVertical(row, column) || checkDiagonal(row, column));
}

function updateScore(){
	$("#player1-score").text(playerScore[0]);
	$("#player2-score").text(playerScore[1]);
}

function init(){
	resetBoard();
	resetScore();
	$(".column").click(columnListener);
	$("#action-rematch").click(function(){
		resetBoard();
		$(".column").click(columnListener);
		currentTurn = 0;
		$("#board-header").text(playerName[currentTurn] + "'s turn");
		$("#buttons").addClass("hidden");
	});
	$("#action-quit").click(function(){
		$("#player1").val("");
		$("#player2").val("");
		$("#buttons").addClass("hidden");
		var boardRight = ($("body").css("width").replace("px","")/2) - ($("#main-menu").css("width").replace("px","")/2);
		$("#game-screen").animate({
			left: "+=600",
			opacity: "hide"
		}, 1000, "easeInOutCubic");
		$("#main-menu").animate({
			left: boardRight,
			opacity: "show"
		}, 1000, "easeInOutCubic");
	});
}

var columnListener = function takeTurn(){
	var column = $(this).data("col");
	var row = $(this).children().size();
	if(row < maxRows){
		
		dropBall(this);
		matrix[row][column] = currentTurn + 1
		if(checkWinner(row, column)){
			playerScore[currentTurn]++;
			updateScore();
			$("#board-header").text(playerName[currentTurn] + " wins!");
			$(".column").unbind();
			$("#buttons").removeClass("hidden");
		} else if(!hasMove()){
			$("#buttons").removeClass("hidden");
			$("#board-header").text("Round draw!");
			$(".column").unbind();
		} else{
			if(currentTurn == 0)
				currentTurn = 1;
			else currentTurn = 0;
			$("#board-header").text(playerName[currentTurn] + "'s turn");
		}
	}
}

function resetBoard(){
	matrix = [[0, 0, 0, 0, 0, 0, 0], 
			  [0, 0, 0, 0, 0, 0, 0], 
			  [0, 0, 0, 0, 0, 0, 0], 
			  [0, 0, 0, 0, 0, 0, 0], 
			  [0, 0, 0, 0, 0, 0, 0], 
			  [0, 0, 0, 0, 0, 0, 0]];
	$(".column").empty();
}

function resetScore(){
	playerScore = [0, 0];
	$("#player1-score").text("0");
	$("#player2-score").text("0");
}

function dropBall(column){
	var ball = $("<div class='btn-floating ball'></div>");
	var width = $(column).css("width").replace("px","") * 0.8;
	var left = $(column).css("width").replace("px","") * 0.1;
		
	var bottomOffset = $(column).children().size() * width + 10;
	var startBottom = parseInt($(column).css("height").replace("px","")) + 400;
	
	ball.css({
		"width": width + "px",
		"height": width + "px",
		"bottom": bottomOffset + "px",
		"left": left
	});
	
	ball.addClass(playerColor[currentTurn] + " darken-2");
	$(column).append(ball);
	
	var bounce = new Bounce();
	bounce.translate({
		from: {x: 0, y: -startBottom},
		to: {x: 0, y: 0}
	});
	bounce.applyTo(ball);
}

function highlightBalls(points){
	points.forEach(function(curr, index, array){
		var row = curr[0];
		var col = curr[1];
		$(".column:nth-child(" + (col+1) + ")")
			.find(".ball:nth-child(" + (row + 1) + ")")
			.removeClass("darken-2")
			.addClass("lighten-3");
	});
}

function checkHorizontal(row, column){
	var mostLeft = column - 3;
	var mostRight = column + 3;
	
	if(mostLeft < 0)
		mostLeft = 0;
	if(mostRight > maxColumns - 1)
		mostRight = maxColumns - 1
	
	var matches = 0;
	var points = [];
	for(var i = mostLeft; i <= mostRight; i++){
		if(matrix[row][i] == currentTurn + 1){
			matches++;
			points.push([row, i]);
			if(matches == 4){
				highlightBalls(points);
				return true;
			}
		} else {
			matches = 0;
			points = [];
		}
	}
	return false;
}

function checkVertical(row, column){
	var matches = 0;
	var mostBottom = row - 3;
	if(mostBottom < 0)
		mostBottom = 0;
	var points = [];
	for(var i = row; i >= mostBottom; i--){
		if(matrix[i][column] == currentTurn + 1){
			matches++;
			points.push([i, column]);
			if(matches == 4){
				highlightBalls(points);
				return true;
			}
		}
		else {
			matches = 0;
			points = [];
		}
	}
	return false;
}

function hasMove(){
	for(var i = 0; i < maxRows; i++){
		for(var j = 0; j < maxColumns; j++){
			if(matrix[i][j] == 0)
				return true;
		}
	}
	return false;
}
function checkDiagonal(row, column){
	var top = row + 3;
	var bottom = row - 3;
	var right = column + 3;
	var left = column - 3;
	
	//top right to bottom left
	var i = top;
	var j = right;
	var matches = 0;
	var points = [];
	while(i >= bottom){
		if(i <= maxRows - 1 && i >= 0 && j >= 0 && j <= maxColumns - 1){
			if(matrix[i][j] == currentTurn + 1){
				matches++;
				points.push([i, j]);
				if(matches == 4){
					highlightBalls(points);
					return true;
				}
			}
			else {
				matches = 0;
				points = [];
			}
		}
		i--;
		j--;
	}
	console.log("top left to bottom right");
	//top left to bottom right
	i = top;
	j = left;
	points = [];
	matches = 0;
	while(i >= bottom){
		if(i <= maxRows - 1 && i >= 0 && j >= 0 && j <= maxColumns - 1){
			if(matrix[i][j] == currentTurn + 1){
				matches++;
				points.push([i, j]);
				if(matches == 4){
					highlightBalls(points);
					return true;
				}
			}
			else {
				matches = 0;
				points = [];
			}
		}
		i--;
		j++;
	}
	console.log("no match");
	return false;
}
