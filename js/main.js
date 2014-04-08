function Grid(size, position){
	//attributes
	this.size = size;
	this.cells = [];
	this.x = position.x;
	this.y = position.y;
	//methods
	this.generateCells;
}

Grid.prototype.generateCells = function (){
	var firstrow = $("<div></div>").addClass("flat-grid-row").attr("id", "flat-grid-first-row");
	var secondrow = $("<div></div>").addClass("flat-grid-row").attr("id", "flat-grid-second-row");
	var thirdrow = $("<div></div>").addClass("flat-grid-row").attr("id", "flat-grid-third-row");
	for (i = 0; i < 3; i++){
		for (j = 0; j < 3; j++){
			var cell = $("<div></div>").addClass("flat-grid-cell").attr("id", j + "-" + i + "-cell");
			for (k = 0; k < 3; k++){
				var row = $("<div></div>").addClass("flat-inner-grid-row");
				for (l = 0; l < 3; l++){
					var innerCell = $("<div></div>").addClass("flat-inner-grid-cell");
					var position = {x : l + j * 3, y : k + i * 3};
					size = 41.75;
					if (cell[position.x]) {
						cell[position.x][position.y] = new Cell(size, position);
					}
					innerCell.attr("id", position.x + "-" + position.y + "-innerCell");
					row.append(innerCell);
				}
				cell.append(row);
			}
			switch (i) {
				case 0:
					firstrow.append(cell);
					break;
				case 1:
					secondrow.append(cell);
					break;
				case 2:
					thirdrow.append(cell);
					break;
			}
		}
	}
	$("#flat-grid-container").append(firstrow);
	$("#flat-grid-container").append(secondrow);
	$("#flat-grid-container").append(thirdrow);
}


function Cell(size, position, div){
	//attributes
	this.size = size;
	this.x = position.x;
	this.y = position.y;
	//methods
	this.update;
	this.getDiv;
}

Cell.prototype.update = function (){
	div = this.getDiv();
	div.css("width", this.size);
	div.css("hight", this.size);
}

Cell.prototype.getDiv = function (){
	var id = "#" + this.x + "-" + this.y + "-innerCell";
	return $(id);
}

function MouseManager(){
	//attributes
	this.events = {}
	//methods
	this.on;
	this.off;
	this.respond;
	this.listen();
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
	$(".flat-grid-cell").hover(function (){
		self.respond("bigcell-hover", {div : $(this)});
	});

	$(".flat-inner-grid-cell").hover(function (){
		self.respond("smallcell-hover", {div : $(this)});
	});

	$(".flat-grid-cell").click(function (){
		self.respond("bigcell-click", {div : $(this), });
	});

	$(".flat-inner-grid-cell").click(function (){
		self.respond("smallcell-click", {div : $(this)});
	});
};

function GameManager(size, players){
	//attributes
	this.players = players;
	//methods
	this.zoomIn;
	this.zoomOut;
	this.setUp;
};

function Animation(){
	this.zoomIn;
	this.zoomOut;
}

Animation.prototype.zoomIn = function(grid){
	var cells = grid.cells;
	for (i = y; i < 3; i++){
		for (x = 0; x < 3; x++){
			cells[x][y].size = 146.25;
			cells[x][y].update;
		}
	}
}
