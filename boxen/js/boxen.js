var divs = document.getElementsByClassName("box");
var slots = [];
var divArray = [];

var totalWidth = Math.floor(window.innerWidth);
var totalHeight = Math.floor(window.innerHeight);
var unitWidth = Math.floor(totalWidth / 3);
var unitHeight = Math.floor(totalHeight / 3);

//	initialization
$(document).ready(function() {
	//	initialize slot array with empty slots

	/*	static variables:
		id: 0 - 8; goes left to right, top to bottom.
		x: distance from left edge of document.
		y: distance from top edge of document.
		width: width of slot.
		height: height of slot.
		non-static variables:
		div: div currently occupying the spot.
		home: true if this slots houses the top left corner of a div
	*/
	for (var i = 0; i < 9; i++) {
		slots.push({
			id: i,
			x: (i % 3) * (unitWidth),
			y: Math.floor(i / 3) * (unitHeight),
			width: unitWidth,
			height: unitHeight,
			div: null,
			occupying: []
		});
	}

	// set properties to every div and match slots
	setup();

	$('.fa-coffee').click(function() {
		add('coffee');
	});

	$('.fa-camera').click(function() {
		add('twist');
	});

	$('.fa-rocket').click(function() {
		add('rocket');
	});

	$('body').keypress(function(e){
		console.log('keypress', String.fromCharCode( e.which ));
		var currDiv = $(findClosestSlot(currentMousePos.x, currentMousePos.y, 1, 1).div);
		console.log("currSlot is " + findClosestSlot(currentMousePos.x, currentMousePos.y, 1, 1).id + " and currDiv is " + currDiv);
		if (String.fromCharCode( e.which ) == "W" && currDiv != null) {
			if (currDiv.hasClass("1w")) {
				currDiv.addClass("2w");
				currDiv.removeClass("1w");
			} else if (currDiv.hasClass("2w")) {
				currDiv.addClass("3w");
				currDiv.removeClass("2w");
			}
			changeWidth(currDiv, unitWidth);
			console.log("should be expanded");
		}
		else if (String.fromCharCode( e.which ) == "w" && currDiv != null) {
			if (currDiv.hasClass("2w")) {
				currDiv.addClass("1w");
				currDiv.removeClass("2w");
			} else if (currDiv.hasClass("3w")) {
				currDiv.addClass("2w");
				currDiv.removeClass("3w");
			}
			changeWidth(currDiv, -(unitWidth));
			console.log("should be expanded");
		}
		else if (String.fromCharCode( e.which ) == "H" && currDiv != null) {
			if (currDiv.hasClass("1h")) {
				currDiv.addClass("2h");
				currDiv.removeClass("1h");
			} else if (currDiv.hasClass("2h")) {
				currDiv.addClass("3h");
				currDiv.removeClass("2h");
			}
			changeHeight(currDiv, unitHeight);
			console.log("should be expanded");
		}
		else if (String.fromCharCode( e.which ) == "h" && currDiv != null) {
			if (currDiv.hasClass("2h")) {
				currDiv.addClass("1h");
				currDiv.removeClass("2h");
			} else if (currDiv.hasClass("3h")) {
				currDiv.addClass("2h");
				currDiv.removeClass("3h");
			}
			changeHeight(currDiv, -(unitHeight));
			console.log("should be expanded");
		}
		else if (String.fromCharCode( e.which ) == "R" && currDiv != null) {
			currDiv.remove();
			setupDrag();
			update();
		}
		calculateOccupations();
	});

	document.body.addEventListener('touchmove', function(event) {
	  event.preventDefault();
	}, false); 

});

function setup() {
	for (var q = 0; q < slots.length; q++) {
		slots[q].div = null;
		slots[q].occupying = [];
	}

	for (var i = 0; i < divs.length; i++) {
		divs[i].style.left = slots[i].x + "px";
		divs[i].style.top = slots[i].y + "px";
	}

	calculateOccupations();

	var boxPrevX;
	var boxPrevY;

	$('.box').draggable({
		stack: '.box',
		scroll: false,
		handle: ".handle",
	});

	$('.handle').unbind("mousedown");
	$('.handle').unbind("mouseup");
	$('.handle').mousedown(press);
	$('.handle').mouseup(unpress);
}

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
});

function press() {
	$(this).parent().addClass('clicked');
		boxPrevX = $(this).parent().css('left').slice(0,-2);
		boxPrevY = $(this).parent().css('top').slice(0,-2);
}

function unpress() {
	$(this).parent().removeClass('clicked');
	snapback($(this).parent(), boxPrevX, boxPrevY);
}

function snapback(drop, prevX, prevY) {
	var prevSlot = findClosestSlot(prevX, prevY, 1, 1);

	var origX = drop.css('left').slice(0, -2);
	var origY = drop.css('top').slice(0,-2);

	var objW = drop.css('width').slice(0, -2) / unitWidth;
	var objH = drop.css('height').slice(0, -2) / unitHeight;

	var newX = Number(origX) + Number(unitWidth / 2);
	var newY = Number(origY) + Number(unitHeight / 2);
	var newSlot = findClosestSlot(newX, newY, objW, objH);

	console.log("switching contents of " + prevSlot.id + " and " +  newSlot.id);
	var holdDiv = newSlot.div;
	newSlot.div = prevSlot.div;
	prevSlot.div = holdDiv;

	update();

	// var newPosX = newSlot.x;
	// var newPosY = newSlot.y;

	// drop.animate({
	// 	left: newPosX,
	// 	top: newPosY
	// }, 200, function(){});
}

function calculateOccupations() {
	var divs = document.getElementsByClassName("box");
	for (var i = 0; i < divs.length; i++) {
		var divWidth = 0;
		var divHeight = 0;

		if ($(divs[i]).hasClass('1w')) {
			divWidth = 1;
		} else if ($(divs[i]).hasClass('2w')) {
			divWidth = 2;
		} else if ($(divs[i]).hasClass('3w')) {
			divWidth = 3;
		}
		divs[i].style.width = slots[i].width * divWidth + "px";

		if ($(divs[i]).hasClass('1h')) {
			divHeight = 1;
		} else if ($(divs[i]).hasClass('2h')) {
			divHeight = 2;
		} else if ($(divs[i]).hasClass('3h')) {
			divHeight = 3;
		}
		divs[i].style.height = slots[i].height * divHeight + "px";

		var visibleWidth = divWidth + (i % 3) > 3 ? 3 - (i % 3) : divWidth;
		var visibleHeight = divHeight + Math.floor(i / 3) > 3 ? 3 - Math.floor(i / 3) : divHeight;

		var occupiedSpaces = [];

		for (var p = 0; p < visibleHeight; p++) {
			for (var q = 0; q < visibleWidth; q++) {
				occupiedSpaces.push(p * 3 + q + i);
				slots[p * 3 + q + i].occupying.push($(divs[i]));
			}
		}

		console.log(i, divWidth, divHeight, visibleWidth, visibleHeight);
		console.log("occupying " + occupiedSpaces.toString());
		slots[i].div = divs[i];
	}
}

function findClosestSlot(left, top, width, height) {
	console.log(left + " " + top + " " + width + " " + height);
	var result;
	for (var i = 0; i < (4 - width); i++) {
		if (left - (i * unitWidth) < unitWidth) {
			break;
		}
	}
	result = i;

	for (var j = 0; j < (4 - height); j++) {
		if (top - (j * unitHeight) < unitHeight) {
			break;
		}
	}
	result = result + (j * 3);

	return slots[result];
}

function changeHeight(div, dH) {
	console.log("dH is " + dH);
	var origHeight = div.css("height").slice(0, -2);
	var newHeight = +origHeight + +dH;
	var newHeight = Math.min(Math.max(newHeight, unitHeight), totalHeight);
	console.log("newHeight is " + newHeight);
	div.animate({
		height: newHeight,
		zIndex: 10
	}, 200, function(){});
}

function changeWidth(div, dW) {
	var origWidth = div.css("width").slice(0, -2);
	var newWidth = +origWidth + +dW;
	var newWidth = Math.min(Math.max(newWidth, unitWidth), totalWidth);
	console.log("newWidth is " + newWidth);
	div.animate({
		width: newWidth,
		zIndex: 10
	}, 200, function(){});
}

function update() {
	for (var i = 0; i < slots.length; i++) {
		if (slots[i].div != null) {
			$(slots[i].div).animate({
				left: slots[i].x,
				top: slots[i].y
			}, 200, function(){});
		}
	}
}

function add(name) {
	console.log('clickt');
	var newDiv = "<div class=\"box 1w 1h\" id=\"box2\"><div class=\"handle\"></div><div class=\"content\" id=\"" + name + "\"></div></div>";
	$('#boxen').append(newDiv);

	setup();
	update();
}
