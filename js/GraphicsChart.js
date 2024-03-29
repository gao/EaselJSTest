var smr = smr || {};

(function($){
	
	// --------- Component Private Properties --------- //
	var canvas;
    var stage;
    var img;
	// --------- /Component Private Properties --------- //

	// --------- Component Interface Implementation ---------- //
	function GraphicsChart(){};
	smr.GraphicsChart = GraphicsChart; 
  
	GraphicsChart.prototype.build = function(data,config){
		var html = $("#tmpl-GraphicsChart").render({});
		return $(html);
	}
		
	GraphicsChart.prototype.postDisplay = function(data, config) {
		var $e = this.$element;
		var thisC = this;
		
		// create a new stage and point it at our canvas:
		canvas = $e.find("#GraphicsChartCanvas")[0];
        // create a new stage and point it at our canvas:
        stage = new Stage(canvas);

        // grab canvas width and height for later calculations:
        w = canvas.width;
        h = canvas.height;
        img = new Image();
        img.onload = layout;
        img.src = "css/images/daisy.png";
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Private API --------- //
	function layout() {
        var arr = [createStar, 
                   createHex, 
                   createLineTo, 
                   createRadialGradientFill, 
                   createEllipse, 
                   createRectGradientFill, 
                   createBitmapFill
                   ];
        var padding = 5;
        var _width = 155;
        var _height = 155;
        var cols = 4;
        var space = 0;
        var l = arr.length;

        var border = createBorder();

        for(var i=0;i<l;i++) {
            var tile = arr[i]();
            tile.x = 42+(_width + padding) *(i%cols);
            tile.y = 42+(i/cols | 0) * (_height+padding);
            stage.addChild(tile);
        }
        stage.addChild(border);
        stage.update();
    }
	
	function createBorder() {
        var container = new Container();
        var s = new Shape();
        s.graphics.beginBitmapStroke(img).setStrokeStyle(32).drawRect(20,20,920,360);
        container.addChild(s);
        return container;
    }
	
    function createTile() {
        var container = new Container();
        var bg = new Shape();
        bg.graphics.beginFill('#CCCCCC').drawRect(0, 0, 155, 155).endFill();
        bg.alpha = 0.25;
        container.addChild(bg);
        return container;
    }
    
    function createStar() {
        var container = createTile();
        var s = new Shape();
        s.graphics.setStrokeStyle(1).beginStroke(Graphics.getRGB(255, 255, 0)).beginFill("#FF0").endStroke().drawPolyStar(0,0,80,5,0.6,-90);
        s.x = 80
        s.y = 85;

        container.addChild(s);
        return container;
    }
    
    function createHex() {
        var container = createTile();
        var s = new Shape();
        s.graphics.beginFill("#0F0").drawPolyStar(0,0,40,6).drawPolyStar(0,75,40,6);
        s.x = 80
        s.y = 40;

        container.addChild(s);
        return container;
    }
    
    function createLineTo() {
        var container = createTile();
        var s = new Shape();
        s.graphics.setStrokeStyle(16, "round", "round").beginStroke("#f90").moveTo(20,10).lineTo(90,90).lineTo(90,140).lineTo(60,140);
        container.addChild(s);
        return container;
    }
    
    function createRadialGradientFill() {
        var container = createTile();
        var s = new Shape();
        s.graphics.ss(8).beginStroke("#f0f").beginRadialGradientFill(["#FFF","#0FF"],[0,1],0,0,0,0,0,40).drawCircle(0,0,40);
        s.x = s.y = 80;
        container.addChild(s);
        return container;
    }
    
    function createEllipse() {
        var container = createTile();
        var s = new Shape();
        s.graphics.f(Graphics.getRGB(0,0x66,0x99,0.5)).setStrokeStyle(4).beginLinearGradientStroke(["#F00","#000"],[0,1],0,0,70,140).drawEllipse(0,0,70,140,8);
        s.x = 40;
        s.y = 10;
        container.addChild(s);
        return container;
    }
    
    function createRectGradientFill() {
        var container = createTile();
        var s = new Shape();
        s.graphics.beginLinearGradientFill(["#FFF","#000"],[0,1],0,0,0,130).drawRect(0,0,130,130);
        s.x = 12;
        s.y = 10;
        container.addChild(s);
        return container;
    }
    
    function createBitmapFill() {
        var container = createTile();
        var s = new Shape();
        s.graphics.beginBitmapFill(img).setStrokeStyle(8).beginRadialGradientStroke(["#FFF","#000"],[0,1],0,0,0,0,30,130).drawRect(0, 0, 130, 130);
        s.x = 12;
        s.y = 10;
        container.addChild(s);
        return container;
    }
	// --------- /Component Private API --------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("GraphicsChart",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.GraphicsChart();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
