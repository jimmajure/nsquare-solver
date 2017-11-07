/**
 * 	A puzzle game that populates 8 squares in a 9 square grid, shuffles them, 
 *  allows the user to return them to the original state by clicking on squares
 *  next to the empty square.
 */
var width = 100;

var nsquareToDraw = null;

var squareSize = 3;
function NSquare(canvas) {
	// an svg element into which the puzzle will be drawn
	this.canvas = canvas;
	// an object representing the emtpy square...
	this.space = {value:-1,x:0,y:0};
	// a 2-D array representing the puzzle state
	this.nsquare = [
		[this.space,{value:1,x:1,y:0},{value:2,x:2,y:0}],
		[{value:3,x:0,y:1},{value:4,x:1,y:1},{value:5,x:2,y:1}],
		[{value:6,x:0,y:2},{value:7,x:1,y:2},{value:8,x:2,y:2}]
	]
	// we need the data put into a 1-d array for d3 display...
	this.data = [];
	for (var i=0;i<3;i++) {
		for (var j=0;j<3;j++) {
			if (!(i==0&&j==0))
				this.data.push(this.nsquare[i][j]);
		}
	}
}

/*
 * Move the blank square in a specified direction, UP, DOWN, LEFT, or RIGHT.
 */
NSquare.prototype.applyMove = function(action) {
	if ("UP" === action) {
		if (this.space.y>0) {
			var aboveSpace = this.nsquare[this.space.y-1][this.space.x];
			this.nsquare[this.space.y][this.space.x] = aboveSpace;
			aboveSpace.y += 1;
			this.nsquare[this.space.y-1][this.space.x] = this.space;
			this.space.y -= 1;
		}
	} else if ("DOWN" === action) {
		if (this.space.y<squareSize-1) {
			var belowSpace = this.nsquare[this.space.y+1][this.space.x];
			this.nsquare[this.space.y][this.space.x] = belowSpace;
			belowSpace.y -= 1;
			this.nsquare[this.space.y+1][this.space.x] = this.space;
			this.space.y += 1;
		}
	} else if ("LEFT" === action) {
		if (this.space.x>0) {
			var leftSpace = this.nsquare[this.space.y][this.space.x-1];
			this.nsquare[this.space.y][this.space.x] = leftSpace;
			leftSpace.x += 1;
			this.nsquare[this.space.y][this.space.x-1] = this.space;
			this.space.x -= 1;
		}
	} else if ("RIGHT" === action) {
		if (this.space.x<squareSize-1) {
			var rightSpace = this.nsquare[this.space.y][this.space.x+1];
			this.nsquare[this.space.y][this.space.x] = rightSpace;
			rightSpace.x -= 1;
			this.nsquare[this.space.y][this.space.x+1] = this.space;
			this.space.x += 1;
		}
	}
	return this.draw();
}

/*
 * Return a list of the currently available actions.
 */
NSquare.prototype.getActions = function() {
	var result = [];
	if (this.space.y>0) result.push("UP");
	if (this.space.y<squareSize-1) result.push("DOWN");
	if (this.space.x>0) result.push("LEFT");
	if (this.space.x<squareSize-1) result.push("RIGHT");
	
	return result;
}

/*
 * Randomly choose an action from actions,
 * but don't go back to where the previous 
 * action (a) brought you from...
 */
function chooseAction(actions, a) {
	var dir = Math.floor(Math.random()*actions.length);
	var nextA = actions[dir];
	if (a=="UP" && nextA == "DOWN") {
		// remove "DOWN" and try again...
		actions.splice(dir,1);
		return chooseAction(actions, a);
	} else if (a=="DOWN" && nextA == "UP") {
		actions.splice(dir,1);
		return chooseAction(actions, a);
	} else if (a=="LEFT" && nextA == "RIGHT") {
		actions.splice(dir,1);
		return chooseAction(actions, a);
	} else if (a=="RIGHT" && nextA == "LEFT") {
		actions.splice(dir,1);
		return chooseAction(actions, a);
	} else {
		return nextA;
	}
}

/*
 * Apply n random moves to the puzzle...
 */
NSquare.prototype.randomize = function(n, doneMarker) {
	var tmpthis = this;
	var i = 0;
	var a = null;
	
	// we want each move to be drawn on the screen, so we
	// need to put the move in a timer...
	var drawer = function() {
		i++;
		if (i<=n) {
			console.log("drawer:"+i);
			var actions = tmpthis.getActions();
			var dir = Math.floor(Math.random()*actions.length);
			a = chooseAction(actions,a);
			tmpthis.applyMove(a);
		}
		if (i<=n+1) {
			d3.timeout(drawer, 250);
		} else {
			doneMarker.done = true;
		}
	}
	d3.timeout(drawer);
}

/*
 * Draw or update the drawing of the puzzle.
 */
NSquare.prototype.draw = function() {
	if (!this.canvas) {
		return;
	}
	// trick to make the click function "this" 
	// context refer to the object.
	// not sure if there's a "right" way to do this
	var tmpthis = this;
	
	// update the data...
	var gupdate = this.canvas
		.selectAll("g")
		.data(this.data);
		
	// on update, animate the change to the data...
	var t = gupdate.transition();
	t.duration(250).ease(d3.easeLinear)
		.attr("transform",function(d) {
			return "translate("+d.x*width+","+d.y*width+")";
		});
		
	// on the initial draw, the data will need to be appended...
	// add a g to hold the square and the text...
	var g = gupdate
		.enter()
		.append("g")
		.attr("transform",function(d) {
			return "translate("+d.x*width+","+d.y*width+")";
		});
	
	// create the squares...
	g.append("rect")
		.attr("x",0).attr("y",0)
		.attr("width",width).attr("height",width)
		.attr("class","square")
		.on("click", function(d){
			tmpthis.click(d);
		});
	
	// add the text...
	g.append("text")
		.attr("class","squaretext")
		.attr("x",width/2).attr("y",2/3*width)
		.attr("text-anchor","middle")
		.text(function (d){return d.value;})
		.on("click", function(d){
			tmpthis.click(d);
		});
}

/*
 * Method to handle a a click on a square. The method
 * receives the object currently located at the square clicked.
 */
NSquare.prototype.click = function(d) {
	// same x and above/below one another
	if ((this.space.x == d.x) && (Math.abs(this.space.y - d.y)==1)) {
		if (this.space.y-d.y < 0) {
			this.applyMove("DOWN");
		} else {
			this.applyMove("UP");
		}
		// same y and left/right of one another
	} else if ((this.space.y == d.y) && (Math.abs(this.space.x - d.x)==1)) {
		if (this.space.x-d.x < 0) {
			this.applyMove("RIGHT");
		} else {
			this.applyMove("LEFT");
		}
	}
}

NSquare.prototype.clone = function () {
	var me2 = JSON.parse(JSON.stringify(this.nsquare));
	var next = new NSquare();
	next.nsquare = me2;
	next.space = next.nsquare[this.space.y][this.space.x];
	return next;
}

function solution(n) {
	var n2 = n;
	var result = [];
	// return the solution...
	while (n2.parent!=null) {
		result.push(n2.action);
		n2 = n2.parent;
	}
	// the order of the path is from the gaol to
	// the initial; we need to reverse it...
	var result2 = [];
	for (var i=result.length-1; i>=0; i--) {
		result2.push(result[i]);
	}
	return result2;
}


function GraphSearch(initial, canvas, maxDepth) {
	this.canvas = canvas;
	this.frontier = new Queue();
//	this.frontier = new Stack();
	this.explored = new Set();
	this.result = [];
	this.initial = initial;
	this.goalState = new NSquare();
	this.goalStateComp = JSON.stringify(this.goalState.nsquare);
	if (!maxDepth) {
		this.maxDepth = 32000;
	} else {
		this.maxDepth = maxDepth;
	}

	var n = {state: initial, parent:null, children: [], action:null, depth: 0};
	this.frontier.enqueue(n);
	// set the root node...
	this.root = n;
	
	this.d3tree = d3.tree();
	
	this.d3tree.size([800,900]);
	this.drawTree();
}


GraphSearch.prototype.searchStep = function() {
	
	if (this.frontier.getLength() == 0) {
		console.log("frontier is empty...");
		return [];
	}
	var n = this.frontier.dequeue();
	console.log(solution(n));
	var ns = JSON.stringify(n.state.nsquare);
//		console.log(ns);
	if (ns==this.goalStateComp) {
		n.winner = true;
		this.drawTree();
		return solution(n);
	} else {
		this.explored.add(ns);
		if (n.depth < this.maxDepth) {
			var actions = n.state.getActions();
			for (var i=0; i<actions.length; i++) {
				var a = actions[i];
				var next = n.state.clone();
//				console.log("before move "+solution(n)+","+a);
//				console.log(JSON.stringify(next.nsquare));
				next.applyMove(a);
//				console.log("after move "+solution(n)+","+a);
//				console.log(JSON.stringify(next.nsquare));
				var nextS = JSON.stringify(next.nsquare);
				if (!(this.explored.has(nextS) || 
						this.frontier.contains(next, function(d){return d.state.nsquare;}))) {
					var node = {state: next, parent:n, children: [], action:a, depth:n.depth+1};
					n.children.push(node);
					this.frontier.enqueue(node);
				}
			}
			this.drawTree();
		}
		return null;
	}
}


GraphSearch.prototype.drawTree = function() {
	var root = d3.hierarchy(this.root);
	var links = this.canvas.selectAll(".link")
		.data(this.d3tree(root).links());
	
	links.attr("d", d3.linkHorizontal()
			.x(function(d) {return d.y;})
			.y(function(d) {return d.x;}));
	
	links.enter().append("path")
			.attr("class", "link")
			.attr("d", d3.linkHorizontal()
					.x(function(d) { return d.y;})
					.y(function(d) { return d.x;}));
	
	links.exit().remove();

	var nodes = tree.selectAll(".node")
		.data(root.descendants());
	
	nodes.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		.classed("node-frontier",function(d){return d.data.inFrontier;})
		.classed("node-winner",function(d){return d.data.winner;});
	nodes.select("circle").attr("r",function(d){
		if (d.data.winner) {
			return 7.5;
		} else {
			return 2.5;
		}
	});
	
	var node = nodes.enter().append("g")
		.attr("class","node")
		.classed("node-frontier",function(d){return d.data.inFrontier;})
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	node.append("circle")
		.attr("r", 5);

	node.append("text")
		.attr("dy", 3)
		.attr("x", function(d) { return d.children ? -8 : 8; })
		.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		.text(function(d) { return d.data.action; });

	nodes.exit().remove();
}

function stepSearch() {
	result = gs.searchStep();
	if (result == null) {
		d3.timeout(stepSearch, 300);
	} else {
		d3.select("#searchHeader")
			.text("Search Tree - Solution: "+result);
	}
}

function initializeSearch() {
	gs = new GraphSearch(ns, tree);
	d3.timeout(stepSearch);
}


function randomize() {
	var v = d3.select("#times").property("value");
	var vi = parseInt(v);
	doneMarker = {done: false};
	ns.randomize(vi, doneMarker);
}

// set up the header and some buttons...
d3.select("body").append("h1").text("N-Square Puzzle Solver")
var gamediv = d3.select("body").append("div")
	.attr("class","tree");
gamediv.append("h2").text("Puzzle");
var buttondiv = gamediv.append("div");
buttondiv.append("button")
	.attr("class","randomize")
	.attr("onclick","randomize()")
	.text("Randomize");
buttondiv.append("input")
	.attr("id","times")
	.attr("class","times")
	.attr("size",4);

// add the svg canvas...
var svg = gamediv.append("svg");
svg.attr("width",400).attr("height",400);
svg.append("rect")
	.attr("x",0).attr("y",0).attr("width",300).attr("height",300)
	.style("fill","grey");

// an element for the tiles...
var boxes = svg.append("g");

// an element for the solution tree...
var treediv = d3.select("body")
	.append("div")
		.attr("class","tree");
var newdiv = treediv.append("div");
newdiv.append("h2")
	.attr("id","searchHeader")
	.text("Search Tree")
newdiv.append("button")
	.attr("class","solve")
	.attr("onclick","initializeSearch()")
	.text("Solve");
var tree = treediv.append("svg");

tree.attr("width",1000).attr("height",800);

var ns = new NSquare(boxes);
ns.draw();





