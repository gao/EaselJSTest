var smr = smr || {};

(function($){
	
	var barHeight;
	var maxValue = 50;

	// --------- Component Interface Implementation ---------- //
	function BarChart(){};
	smr.BarChart = BarChart; 
  
	BarChart.prototype.build = function(data,config){
		var html = $("#tmpl-BarChart").render({});
		return $(html);
	}
		
	BarChart.prototype.postDisplay = function(data, config) {
		var $e = this.$element;
		var thisC = this;

		var canvas;
		var stage;
		var barPadding = 7;
		var count;
		var barValues = [];
		var bars = [];
		
		// create a new stage and point it at our canvas:
		canvas = $e.find("#BarChartCanvas")[0];
		stage = new Stage(canvas);

		// generate some random data (between 4 and 10, the |0 floors (for positive numbers))
		var numBars = Math.random()*6+4|0;
		var max = 0;
		for (var i=0; i<numBars; i++) {
			var val = Math.random()*maxValue+1|0;
			if (val > max) { max = val; }
			barValues.push(val);
		}

		// calculate the bar width and height based on number of bars and width of canvas:
		var barWidth = (canvas.width-150-(numBars-1)*barPadding)/numBars;
		barHeight = canvas.height-150;

		// create a shape to draw the background into:
		var bg = new Shape();
		stage.addChild(bg);

		// draw the "shelf" at the bottom of the graph:
		// note how the drawing instructions can be chained together.
		bg.graphics.beginStroke("#444")
			.moveTo(40, canvas.height-69.5)
			.lineTo(canvas.width-70, canvas.height-69.5)
			.endStroke()
			.beginFill("#222")
			.moveTo(canvas.width-70, canvas.height-70)
			.lineTo(canvas.width-60, canvas.height-80)
			.lineTo(50, canvas.height-80)
			.lineTo(40, canvas.height-70)
			.closePath();

		// draw the horizontal lines in the background:
		for (i=0; i<9; i++) {
			bg.graphics.beginStroke(i%2 ? "#333" : "#444")
				.moveTo(50,(canvas.height-80-i/8*barHeight|0)+0.5)
				.lineTo(canvas.width-60,(canvas.height-80-i/8*barHeight|0)+0.5);
		}

		// add the graph title:
		label = new Text("Bar Chart Demo", "bold 30px Arial", "#000");
		label.textAlign = "center";
		label.x = canvas.width/2;
		label.y = 50;
		stage.addChild(label);

		// draw the bars:
		for (i=0; i<numBars; i++) {
			// each bar is assembled in it's own Container, to make them easier to work with:
			var bar = new Container();

			// this will determine the color of each bar, save as a property of the bar for use in drawBar:
			var hue = bar.hue = i/numBars*360;

			// draw the front panel of the bar, this will be scaled to the right size in drawBar:
			var front = new Shape();
			front.graphics.beginLinearGradientFill(
					[Graphics.getHSL(hue,100,60,0.9),
					Graphics.getHSL(hue,100,20,0.75)],
					[0,1],
					0,
					-100,
					barWidth,0).drawRect(0,-100,barWidth+1,
					100);

			// draw the top of the bar, this will be positioned vertically in drawBar:
			var top = new Shape();
			top.graphics.beginFill(Graphics.getHSL(hue,100,70,0.9))
				.moveTo(10,-10)
				.lineTo(10+barWidth,-10)
				.lineTo(barWidth,0)
				.lineTo(0,0)
				.closePath();

			// if this has the max value, we can draw the star into the top:
			if (barValues[i] == max) {
				top.graphics.beginFill("rgba(0,0,0,0.45)").drawPolyStar(barWidth/2, 31, 7, 5, 0.6, -90).closePath();
			}

			// prepare the side of the bar, this will be drawn dynamically in drawBar:
			var right = new Shape();
			right.x = barWidth-0.5;

			// create the label at the bottom of the bar:
			var label = new Text("Label "+i, "16px Arial", "#FFF");
			label.textAlign = "center";
			label.x = barWidth/2;
			label.maxWidth = barWidth;
			label.y = 26;
			label.alpha = 0.5;

			// draw the tab that is placed under the label:
			var tab = new Shape();
			tab.graphics.beginFill(Graphics.getHSL(hue,100,20))
				.drawRoundRectComplex(0,1,barWidth,38,0,0,10,10);

			// create the value label that will be populated and positioned by drawBar:
			var value = new Text("foo","bold 14px Arial","#000");
			value.textAlign = "center";
			value.x = barWidth/2;
			value.alpha = 0.45;

			// add all of the elements to the bar Container:
			bar.addChild(right,front,top,value,tab,label);

			// position the bar, and add it to the stage:
			bar.x = i*(barWidth+barPadding)+60;
			bar.y = canvas.height-70;

			stage.addChild(bar);
			bars.push(bar);

			// draw the bar with an initial value of 0:
			drawBar(bar, barValues[i]);
		}

		// update the stage:
		stage.update();
	}
	// --------- /Component Interface Implementation ---------- //
	
	function drawBar(bar, value) {
		// calculate bar height:
		var h = value/maxValue*barHeight;

		// update the value label:
		var val = bar.getChildAt(3);
		val.text = value|0;
		val.visible = (h>28);
		val.y = -h+22;

		// scale the front panel, and position the top:
		bar.getChildAt(1).scaleY = h/100;
		bar.getChildAt(2).y = -h+0.5; // the 0.5 eliminates gaps from numerical precision issues.

		// redraw the side bar (we can't just scale it because of the angles):
		var right = bar.getChildAt(0);
		right.graphics.clear()
			.beginFill(Graphics.getHSL(bar.hue,90,15,0.7))
			.moveTo(0,0)
			.lineTo(0,-h)
			.lineTo(10,-h-10)
			.lineTo(10,-10)
			.closePath();
	}
	
	// --------- Component Registration --------- //
	brite.registerComponent("BarChart",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.BarChart();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);