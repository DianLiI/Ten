function Grid(size, position){
	//attributes
	this.size = size;
	this.cells = [];
	this.x = position.x;
	this.y = position.y;
	this.currx = (this.x + 1) * 146.25;
	this.curry = (this.y + 1) * 146.25;
	//methods
	this.generateCells;
}

Grid.prototype.generateCells = function (){
	for (i = 0; i < 3; i++){
		for (j = 0; j < 3; j++){
			for (k = 0; k < 3; k++){
				for (l = 0; l < 3; l++){
					var position = {x : l + j * 3, y : k + i * 3};
					size = 41.75;
					if (this.cells[position.x]) {
						this.cells[position.x][position.y] = new Cell(size, position);
					}else{
						this.cells[position.x] = [];
						this.cells[position.x][position.y] = new Cell(size, position);
					}
				}
			}
		}
	}
}


function Cell(size, position, div){
	//attributes
	this.size = size;
	this.x = position.x;
	this.y = position.y;
	this.color;
	//methods
	this.update;
	this.getDiv;
	this.enlarge;
}

Cell.prototype.update = function (){

	var cellid = "#" + "innerCell-"+ this.x + "-" + this.y;
	div = this.getDiv(cellid);
	var browid = "#" + div.parent().parent().parent().attr("id");
	var bcellid = "#" + div.parent().parent().attr("id");
	var rowid = "." + div.parent().attr("class");
	
	move(rowid)
		.set("height", "146.25px")
		.end();
	move(bcellid)
		.set("height", "472px")
		.set("width", "472px")
		.end()
	move(browid)
		.set("height", "472px")
		.set("float", "left")
		.end();
	move(cellid)
		.set("height", this.size)
		.set("width", this.size)
		.end();
}

Cell.prototype.getDiv = function (id){
	return $(id);
}

Cell.prototype.enlarge = function (){
	this.size = 146.25;
	this.update();
}

function MouseManager(){
	//attributes
	this.events = {}
	//methods
	this.on;
	this.off;
	this.respond;
	this.listen;
}

MouseManager.prototype.on = function (event, callback) {
	if (!this.events[event]) {
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

MouseManager.prototype.off = function (event){
	if (this.events[event]) {
		this.events[event] = [];
	};
};

MouseManager.prototype.respond = function (event, data){
	if (this.events[event]) {
	 	var callbacks = this.events[event];
	 	callbacks.forEach(function (callback){
	 		callback(data);
	 	});
 	};
};

MouseManager.prototype.listen = function (data){
	var self = this;
	$(".indicator-cell").hover(function (){
		self.respond("indicator-hover", {div:$(this)});
	});

	$(".tictactoe-cell").hover(function (){
		self.respond("tictactoe-hover", {div:$(this), grids: data.grids});
	});

	$(".indicator-cell").click(function (){
		self.respond("indicator-click", {div:$(this), grids: data.grids});
	});

	$(".tictactoe-cell").click(function (){
		self.respond("tictactoe-click", {div:$(this), grids: data.grids});
	});
};

function HTMLActuator(){
	this.indicatorSelector = ".indicator-board";
	this.tictactoeSelector = "tictactoe-board";
	this.gameContainerSelector = ".game-container";
	this.indicatorBoard = "";
	this.tictactoeBoard = "";
}

HTMLActuator.prototype.shrinkIndicator = function (x, y) {
	var self = this;
	$.each($(self.indicatorSelector).children(), function (index_row, row) {
		$.each($(row).children(), function (index_cell, cell) {
			$.each($(cell).children(), function(index_innerRow, innerRow) {
				$.each($(innerRow).children(), function (index_innerCell, innerCell) {
					$(innerCell).addClass("indicator-innerCell-shrinked");
				});
				$(innerRow).addClass("indicator-innerRow-shrinked");
			});
			$(cell).addClass("indicator-cell-shrinked");
			if(index_row == y && index_cell == x){
				$(cell).addClass("selected");
			}
		});
		$(row).addClass("indicator-row-shrinked");
	});
}

HTMLActuator.prototype.showTictactow = function (grid) {
	$(this.gameContainerSelector).append(this.tictactoeBoard);
	var div = $(this.tictactoeSelector);
	$.each(div.children(), function (index_row, row) {
		$.each($(row).children(), function (index_cell, cell) {
			var c = grid.cells[index_cell][index_row];
			if (c.color){
				$(cell).css("color", c.color);
			}
		});
	});
}

HTMLActuator.prototype.init = function (){
	this.tictactoeBoard = $("<div></div>").addClass("tictactoe-board");
	this.indicatorBoard = $("<div></div>").addClass("indicator-board");
	for (y = 0; y < 3; y++){
		var row = $("<div></div>").addClass("tictactoe-row");
		for(x = 0; x < 3; x++){
			var cell = $("<div></div>").addClass("tictactoe-cell").addClass("tictactoe-cell-" + x + "-" + y);
			row.append(cell);
		}
		this.tictactoeBoard.append(row);
	}
	for (y1 = 0; y1 < 3; y1++){
		var row = $("<div></div>").addClass("indicator-row");
		for (x1 = 0; x1 < 3; x1++){
			var cell = $("<div></div>").addClass("indicator-cell").addClass("indicator-cell-" + x1 + "-" + y1);
			for (y2 = 0; y2 < 3; y2++){
				var innerRow = $("<div></div>").addClass("indicator-innerRow");
				for (x2 = 0; x2 < 3; x2++){
					var innerCell = $("<div></div>").addClass("indicator-innerCell");
					innerCell.addClass("innerCell-" + (x2 + x1 * 3) + "-" + (y2 + y1 * 3));
					innerRow.append(innerCell);
				}
				cell.append(innerRow);
			}
			row.append(cell);
		}
		this.indicatorBoard.append(row);
	}
	
	$(this.gameContainerSelector).append(this.indicatorBoard);
}


function GameManager(){
	//attributes
	this.grids = [[], [], []]
	this.mouseManager;
	this.animation;
	//methods
	this.setUp;
};

GameManager.prototype.setUp = function () {
	this.mouseManager = new MouseManager();
	this.htmlActuator = new HTMLActuator();
	this.htmlActuator.init();
	var bgrid = new Grid(0, {x: 1, y : 2});
	bgrid.generateCells();
	for (y1 = 0; y1 < 3; y1++){
		for(x1 = 0; x1 < 3; x1++){
			var grid = new Grid(146.25, {x:x1, y:y1});
			for(y2 = 0; y2 < 3; y2++){
				for(x2 = 0; x2 < 3; x2++){
					if(grid.cells[x2]){
						grid.cells[x2][y2] = bgrid.cells[x1 * 3 + x2][y1 * 3 + y2];
					}else{
						grid.cells[x2] = [];
						grid.cells[x2][y2] = bgrid.cells[x1 * 3 + x2][y1 * 3 + y2];
					}	
				}
			}
			this.grids[x1][y1] = grid;
		}
	}
	self = this;
	this.mouseManager.on("indicator-hover", function(data){
		var div = data.div;
		div.css("opacity", "0.5");
		div.mouseleave(function(){
			div.css("opacity", "1")
		});
	});
	this.mouseManager.on("indicator-click", function(data){
		var div = data.div;
		var grids1 = data.grids;
		pos = div.attr("class").split(" ")[1].split("-");
		x = parseInt(pos[2]);
		y = parseInt(pos[3]);
		self.htmlActuator.shrinkIndicator(x, y);
		self.htmlActuator.showTictactow(grids1[x][y]);
		self.mouseManager.off("indicator-hover");
		self.mouseManager.on("tictactoe-hover", function(data) {
			var div = data.div;
			div.css("opacity", "0.5");
			div.mouseleave(function(){
				div.css("opacity", "1")
			});
		});
		self.mouseManager.on("tictactoe-click", function (data) {
			var div = data.div;
			var grid = data.grids[x][y];
			pos = div.attr("class").split(" ")[1].split("-");
			x = pos[2];
			y = pos[3];
			console.log(div);
			if (self.color = "red"){
				div.addClass("red")
				grid.cells[x][y].color = "red";
			}else{
				div.addClass("blue");
				grid.cells[x][y].color = "blue";
			}
		});
		self.mouseManager.listen({grids: data.grids});
	});
	this.mouseManager.listen({grids: this.grids});
	
}

