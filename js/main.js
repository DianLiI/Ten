function Grid(size, position){
	//attributes
	this.size = size;
	this.cells = [];
	this.x = position.x;
	this.y = position.y;
	this.class;
	this.color = 0;
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
					var cell = new Cell(size, position);
					cell.class = "innerCell-" + position.x + "-" + position.y;
					if (this.cells[position.x]) {
						this.cells[position.x][position.y] = cell;
					}else{
						this.cells[position.x] = [];
						this.cells[position.x][position.y] = cell;
					}
				}
			}
		}
	}
}


function Cell(size, position){
	//attributes
	this.size = size;
	this.x = position.x;
	this.y = position.y;
	this.color = 0;
	this.class;

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
	if (callback){
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	}else{
		this.events[event] = this.events[event + "1"];
	}
};

MouseManager.prototype.off = function (event){
	if (this.events[event] && this.events[event].length > 0)
		this.events[event + "1"] = this.events[event];
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
	$(".cell").hover(function (){
		self.respond("cell-hover", {div:$(this)});
	});

	$(".innerCell").hover(function (){
		self.respond("innerCell-hover", {div:$(this), grids: data.grids});
	});

	$(".cell").click(function (){
		self.respond("cell-click", {div:$(this), grids: data.grids});
	});

	$(".innerCell").click(function (){
		self.respond("innerCell-click", {div:$(this), grids: data.grids});
	});
};

function HTMLActuator(){
	this.gameContainer = ".game-container";
	this.mainBoard = ".main-board";
}

HTMLActuator.prototype.init = function (){
	var mainBoard = $("<div></div>").addClass("main-board");
	for (y1 = 0; y1 < 3; y1++){
		var row = $("<div></div>").addClass("row");
		for (x1 = 0; x1 < 3; x1++){
			var cell = $("<div></div>").addClass("cell").addClass("cell-" + x1 + "-" + y1);
			for (y2 = 0; y2 < 3; y2++){
				var innerRow = $("<div></div>").addClass("innerRow");
				for (x2 = 0; x2 < 3; x2++){
					var innerCell = $("<div></div>").addClass("innerCell");
					innerCell.addClass("innerCell-" + (x2 + x1 * 3) + "-" + (y2 + y1 * 3));
					innerRow.append(innerCell);
				}
				cell.append(innerRow);
			}
			row.append(cell);
		}
		mainBoard.append(row);
	}
	
	$(this.gameContainer).append(mainBoard);
}

HTMLActuator.prototype.setOpacity = function (selector, opacity){
	move(selector).set("opacity", opacity).duration("3s").end();
}

HTMLActuator.prototype.rotate = function (selector, deg) {
	move(selector).rotate(deg).end();
}

HTMLActuator.prototype.selectCell = function (grid, grids) {
	for (y = 0; y < 3; y++){
		for (x = 0; x < 3; x++){
			if(x != grid.x || y != grid.y){
				this.setOpacity("." + grids[x][y].class, "0.2");
			}
		}
	}
	this.setColor("." + grid.class, "#000000");
	this.setOpacity("." + grid.class, "1");
	this.rotate("." + grid.class, 0);
}

HTMLActuator.prototype.setColor = function (selector, color) {
	move(selector).set("background", color).end();
}


function GameManager(){
	//attributes
	this.grids = [[], [], []]
	this.mouseManager;
	this.animation;
	this.player = 0;
	this.playerZeroColor = "#e64135";
	this.playerOneColor = "#333333";
	//methods
	this.setUp;
};

GameManager.prototype.checkWin = function (grid) {
	var cells = grid.cells;
	var row1 = cells[0][0].color + cells[1][0].color + cells[2][0].color;
	var row2 = cells[0][1].color + cells[1][1].color + cells[2][1].color;
	var row3 = cells[0][2].color + cells[1][2].color + cells[2][2].color;
	var col1 = cells[0][0].color + cells[0][1].color + cells[0][2].color;
	var col2 = cells[1][0].color + cells[1][1].color + cells[1][2].color;
	var col3 = cells[2][0].color + cells[2][1].color + cells[2][2].color;
	var dia1 = cells[0][0].color + cells[1][1].color + cells[2][2].color;
	var dia2 = cells[2][0].color + cells[1][1].color + cells[0][2].color;
	var small = row1 == 3 || row1 == -3 || row2 == 3 || row2 == -3 || row3 == 3 || row3 == -3 ||
				col1 == 3 || col1 == -3 || col2 == 3 || col2 == -3 || col3 == 3 || col3 == -3 ||
				dia1 == 3 || dia1 == -3 || dia2 == 3 || dia2 == -3;
	if (small) {
		$("." + grid.class).empty();
		if (this.player == 0) {
			this.htmlActuator.setColor("." + grid.class, this.playerZeroColor);
			grid.color = -1;
		}else {
			this.htmlActuator.setColor("." + grid.class, this.playerOneColor);
			grid.color = 1;
		};
		var grids = this.grids;
		row1 = grids[0][0].color + grids[1][0].color + grids[2][0].color;
		row2 = grids[0][1].color + grids[1][1].color + grids[2][1].color;
		row3 = grids[0][2].color + grids[1][2].color + grids[2][2].color;
		col1 = grids[0][0].color + grids[0][1].color + grids[0][2].color;
		col2 = grids[1][0].color + grids[1][1].color + grids[1][2].color;
		col3 = grids[2][0].color + grids[2][1].color + grids[2][2].color;
		dia1 = grids[0][0].color + grids[1][1].color + grids[2][2].color;
		dia2 = grids[2][0].color + grids[1][1].color + grids[0][2].color;
		return 	row1 == 3 || row1 == -3 || row2 == 3 || row2 == -3 || row3 == 3 || row3 == -3 ||
				col1 == 3 || col1 == -3 || col2 == 3 || col2 == -3 || col3 == 3 || col3 == -3 ||
				dia1 == 3 || dia1 == -3 || dia2 == 3 || dia2 == -3;
	};
	return false;
}

GameManager.prototype.reset = function () {
	$(".game-container").empty();
	$(".cell").off("hover");
	$(".innerCell").off("hover");
	$(".cell").off("click");
	$(".innerCell").off("click");
    this.mouseManager.off("cell-hover");
    this.mouseManager.off("cell-click");
	this.mouseManager.off("innerCell-click");
	this.mouseManager.off("innerCell-hover");
	this.setUp();
	// this.htmlActuator.init();
	// for (y1 = 0; y1 < 3; y1++){
	// 	for(x1 = 0; x1 < 3; x1++){
	// 		var grid = new Grid(146.25, {x:x1, y:y1});
	// 		for(y2 = 0; y2 < 3; y2++){
	// 			for(x2 = 0; x2 < 3; x2++){
	// 				this.grids[x1][y1].cells[x2][y2].color = 0;
	// 			}
	// 		}
	// 	}
	// }
 //    this.mouseManager.off("cell-hover");
 //    this.mouseManager.off("cell-click");
	// this.mouseManager.off("innerCell-click");
	// this.mouseManager.off("innerCell-hover");
 //    this.mouseManager.on("cell-hover");
 //    this.mouseManager.on("cell-click");
}

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
			grid.class = "cell-" + x1 + "-" + y1;
			this.grids[x1][y1] = grid;
		}
	}
	this.mouseManager.listen({grids: this.grids});
	self = this;
	self.mouseManager.on("cell-hover", function(data){
		var div = data.div;
		var grids = self.grids;
		pos = div.attr("class").split(" ")[1].split("-");
		var x = parseInt(pos[1]);
		var y = parseInt(pos[2]);
		if (!grids[x][y].color){
			selector = "." + div.attr("class").split(" ")[1];
			move(selector)
				.scale(1.1)
				.end();
			div.mouseleave(function(){
				self.htmlActuator.rotate(selector, 0);
			});
		}
	});
	this.mouseManager.on("cell-click", function (data){
		var div = data.div;
		var grids = data.grids;
		pos = div.attr("class").split(" ")[1].split("-");
		var x = parseInt(pos[1]);
		var y = parseInt(pos[2]);
		if (!grids[x][y].color){
			self.mouseManager.off("cell-hover");
			self.mouseManager.off("cell-click");
			self.htmlActuator.selectCell(grids[x][y], grids);
			self.mouseManager.on("innerCell-hover", function (data) {
				var div = data.div;
				var grids = data.grids;
				pos = div.attr("class").split(" ")[1].split("-");
				var _x = parseInt(pos[1]);
				var _y = parseInt(pos[2]);
				grid_x = Math.floor(_x / 3);
				grid_y = Math.floor(_y / 3);
				cell_x = _x % 3;
				cell_y = _y % 3;
				var selector = "." + div.attr("class").split(" ")[1];
				if (!self.grids[grid_x][grid_y].cells[cell_x][cell_y].color && grid_x == x && grid_y == y) {
					self.htmlActuator.rotate(selector, 180);
					div.mouseleave(function(){
						self.htmlActuator.rotate(selector, 0);
					});
				};
			});
			self.mouseManager.on("innerCell-click", function (data) {
				var div = data.div;
				pos = div.attr("class").split(" ")[1].split("-");
				var _x = parseInt(pos[1]);
				var _y = parseInt(pos[2]);
				grid_x = Math.floor(_x / 3);
				grid_y = Math.floor(_y / 3);
				cell_x = _x % 3;
				cell_y = _y % 3;
				if (!self.grids[grid_x][grid_y].cells[cell_x][cell_y].color && grid_x == x && grid_y == y) {
					var selector = "." + div.attr("class").split(" ")[1];
					if (self.player == 0){
						self.htmlActuator.setColor(selector, self.playerZeroColor);
						self.grids[grid_x][grid_y].cells[cell_x][cell_y].color = -1;
					}
					else{
						self.htmlActuator.setColor(selector, self.playerOneColor);
						self.grids[grid_x][grid_y].cells[cell_x][cell_y].color = 1;
					}
					self.mouseManager.off("innerCell-click");
					self.mouseManager.off("innerCell-hover");
					if (self.checkWin(self.grids[grid_x][grid_y])) {
						if (self.player == 0){
							alert("Player1 win");
						}else{
							alert("Player2 win");
						}
					}else {
						self.player = 1 - self.player;
						if (!self.grids[cell_x][cell_y].color) {
							self.htmlActuator.selectCell(self.grids[cell_x][cell_y], self.grids);
							x = cell_x;
							y = cell_y;
							self.mouseManager.on("innerCell-hover");
							self.mouseManager.on("innerCell-click");
						}else {
							x = cell_x;
							y = cell_y;
							for (y1 = 0; y1 < 3; y1++){
								for (x1 = 0; x1 < 3; x1++){
									self.htmlActuator.setOpacity("." + self.grids[x1][y1].class, "1");
								}
							}
							self.mouseManager.on("cell-hover");
							setTimeout(function() {self.mouseManager.on("cell-click");}, 10);
						};
					}
				}
			});
		}
	});
	
}

