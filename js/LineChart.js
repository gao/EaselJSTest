var smr = smr || {};

(function($){

	// --------- Component Interface Implementation ---------- //
	function LineChart(){};
	smr.LineChart = LineChart; 
  
	LineChart.prototype.build = function(data,config){
		var html = $("#tmpl-LineChart").render({});
		return $(html);
	}
		
	LineChart.prototype.postDisplay = function(data, config) {
		var $e = this.$element;
		var thisC = this;

		var canvas;
		var stage;
		var maxValue = 50;
		var barValues = [];

		// create a new stage and point it at our canvas:
		canvas = $e.find("#LineChartCanvas")[0];
		stage = new Stage(canvas);
			
		// generate some random data (between 4 and 10, the |0 floors (for positive numbers))
		var numBars = 5;
		var max = 0; 
		for (var i=0; i<numBars; i++) {
			var val = Math.random()*maxValue+1|0;
			if (val > max) { max = val; }
			barValues.push(val);
		}
						
		// create a shape to draw the background into:
		var bg = new Shape();
		stage.addChild(bg);
						
		// draw the horizontal lines in the background
		for (i=0; i<6; i++) {
			bg.graphics.beginStroke("#999")
				.moveTo(50,((canvas.height-100)/5) * i + 60)
				.lineTo(canvas.width-60,((canvas.height-100)/5) * i + 60);
		}
			
		// draw the vertical lines in the background
		for (i=0; i< numBars; i++) {
			bg.graphics.beginStroke("#999")
				.moveTo(((canvas.width-110)/(numBars-1)) * i + 50 , 60)
				.lineTo(((canvas.width-110)/(numBars-1)) * i + 50 , canvas.height-40);
		}
			
		//draw the chart lines in the background
		for (i=0; i< numBars-1; i++) {
			bg.graphics.beginStroke("rgba(255,102,0,0.75)")
				.moveTo(((canvas.width-110)/(numBars-1)) * i + 50 , canvas.height-40 -(((canvas.height-100)/50)*barValues[i]) )
				.lineTo(((canvas.width-110)/(numBars-1)) * (i+1) + 50 , canvas.height-40 -(((canvas.height-100)/50)*barValues[i+1]));
		}
			
		//draw the chart point in the background
		for (i=0; i< numBars; i++) {
			var circlePoint = new Shape();
			circlePoint.graphics.beginFill("rgba(255,102,0,0.75)")
				.drawCircle(((canvas.width-110)/(numBars-1)) * i + 50 , canvas.height-40 -(((canvas.height-100)/50)*barValues[i]),5).closePath();
			stage.addChild(circlePoint);
		}
			
			
		// add the graph title:
		label = new Text("Line Chart Demo", "bold 20px Arial", "#000");
		label.textAlign = "center";
		label.x = canvas.width/2;
		label.y = 30;
		stage.addChild(label);
			
		// draw the x_label
		for (i=0; i< numBars; i++) {
			var x_label = new Text("name"+i, "bold 10px Arial", "#000");
			x_label.textAlign = "center";
			x_label.x = ((canvas.width-110)/(numBars-1)) * i + 50 ;
			x_label.y = canvas.height-10;
			stage.addChild(x_label);
		}
			
		// draw the y_label
		for (i=0; i< 6; i++) {
			var y_label = new Text(""+(50-i*10), "bold 10px Arial", "#000");
			y_label.textAlign = "center";
			y_label.x = 20 ;
			y_label.y = ((canvas.height-100)/5) * i + 65;
			stage.addChild(y_label);
		}
				
		stage.update();
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("LineChart",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.LineChart();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
