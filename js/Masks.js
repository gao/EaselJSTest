var smr = smr || {};

(function($){
	
	// --------- Component Private Properties --------- //
	var img, star, stage;
	// --------- /Component Private Properties --------- //

	// --------- Component Interface Implementation ---------- //
	function Masks(){};
	smr.Masks = Masks; 
  
	Masks.prototype.build = function(data,config){
		var html = $("#tmpl-Masks").render({});
		return $(html);
	}
		
	Masks.prototype.postDisplay = function(data, config) {
		var $e = this.$element;
		var c = this;
		
		img = new Image();
		img.onload = handleImageLoad;
		img.src = "css/images/photo.jpg";
		
		var canvas = $e.find("#MasksCanvas")[0];
		stage = new Stage(canvas);
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- /Component Private API --------- //
	function handleImageLoad() {
		star = new Shape();
		// the mask's position will be relative to the parent of its target:
		star.x = img.width/2;
		star.y = img.height/2;
		// only the drawPolyStar call is needed for the mask to work:
		star.graphics.beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,img.height/2-15,5,0.6).closePath();
		
		var bg = new Bitmap(img);
		// blur and desaturate the background image:
		bg.filters = [new BoxBlurFilter(2,2,2), new ColorMatrixFilter(new ColorMatrix(0,0,-100,0))];
		bg.cache(0,0,img.width,img.height);
		stage.addChild(bg);
		
		var bmp = new Bitmap(img);
		stage.addChild(bmp);
		bmp.mask = star;
		stage.addChild(star);

		Ticker.addListener(tick);
	}
	
	function tick() {
		star.rotation += 5;
		// update the stage:
		stage.update();
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("Masks",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.Masks();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
