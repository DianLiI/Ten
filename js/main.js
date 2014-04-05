function Grid(size, position){
	//attributes
	this.size = size;
	this.cells = {};
	this.x = position["x"];
	this.y = position["y"];
	//methods
	this.generateCells;
}


function Cell(size, position){
	this.size = size;
	this.position = position;
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

MouseManager.prototype.listen = function (){
	var self = this;
	$(".flat-grid-cell").hover(function (){
		self.respond("bigcell-hover", $(this));
	});

	$(".flat-inner-grid-cell").hover(function (){
		self.respond("smallcell-hover", $(this));
	});

	$(".flat-grid-cell").click(function (){
		self.respond("bigcell-click", $(this));
	});

	$(".flat-inner-grid-cell").click(function (){
		self.respond("smallcell-click", $(this));
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

GameManager.prototype.zoomIn = function (){
	
}

