var smr = smr || {};

(function($){
	
	// --------- Component Private Properties --------- //
	var canvas;
	var stage;
    var isMouseDown;
    var currentShape;
    var oldMidX, oldMidY, oldX, oldY;
    var txt;
    // --------- /Component Private Properties --------- //
	
	// --------- Component Interface Implementation ---------- //
	function CurveToDraw(){};
	smr.CurveToDraw = CurveToDraw; 
  
	CurveToDraw.prototype.build = function(data,config){
		var html = $("#tmpl-CurveToDraw").render({});
		return $(html);
	}
		
	CurveToDraw.prototype.postDisplay = function(data, config) {
		var $e = this.$element;
		var thisC = this;
		
		txt = new Text("Click and Drag to Draw", "30px Arial", "#777" );
		txt.x = 300;
		txt.y = 200;
		
		canvas = $e.find("#CurveToDrawCanvas")[0];
		stage = new Stage(canvas);
		stage.autoClear = true;
		stage.onMouseDown = handleMouseDown;
		stage.onMouseUp = handleMouseUp;
		
		Touch.enable(stage);
		
		stage.addChild(txt);
		stage.update();
		Ticker.addListener(tick);
		
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Private API --------- //	
	function stop(){
		Ticker.removeListener(tick);
	}
	
	function tick(){
		if(isMouseDown){
			 var pt = new Point(stage.mouseX, stage.mouseY);
             var midPoint = new Point(oldX + pt.x>>1, oldY+pt.y>>1);
             currentShape.graphics.moveTo(midPoint.x, midPoint.y);
             currentShape.graphics.curveTo(oldX, oldY, oldMidX, oldMidY);

             oldX = pt.x;
             oldY = pt.y;

             oldMidX = midPoint.x;
             oldMidY = midPoint.y;

             stage.update();
		}else{
			stop();
		}
	}
	
	function handleMouseDown(){
		Ticker.addListener(tick);
		
		isMouseDown = true;
		stage.removeChild(txt);
		
		var s = new Shape();
		oldX = stage.mouseX;
		oldY = stage.mouseY;
		oldMidX = stage.mouseX;
		oldMidY = stage.mouseY;
		
		var g = s.graphics;
		g.setStrokeStyle(11, 'round', 'round');
		g.beginStroke("#000");
		
		stage.addChild(s);
		currentShape = s;
	}
	
	function handleMouseUp(){
		isMouseDown = false;
	}
	// --------- /Component Private API --------- //	
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("CurveToDraw",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.CurveToDraw();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
