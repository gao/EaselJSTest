var smr = smr || {};

(function($){

	// --------- Component Private Properties --------- //
	var img;
	var canvas;
	var stage;
	// --------- /Component Private Properties --------- //
	
	// --------- Component Interface Implementation ---------- //
	function FilterChart(){};
	smr.FilterChart = FilterChart; 
  
	FilterChart.prototype.build = function(data,config){
		var html = $("#tmpl-FilterChart").render({});
		return $(html);
	}
		
	FilterChart.prototype.postDisplay = function(pdata, config) {
		var $e = this.$element;
		var thisC = this;
		
		//wait for the image to load
		img = new Image();
		img.onload = handleImageLoad;
		img.src = "css/images/photo.jpg";
		
		canvas = $e.find("#FilterChartCanvas")[0];

		// create a new stage and point it at our canvas:
		stage = new Stage(canvas);
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Private API --------- //
	function handleImageLoad() {
		var bmp = new Bitmap(img);
		bmp.x = (canvas.width-2*img.width)/3;
		bmp.y = (canvas.height-2*img.height)/3;
		stage.addChild(bmp);

		var blurFilter = new BoxBlurFilter(32, 2, 2);
		var margins = blurFilter.getBounds();
		bmp = bmp.clone();
		bmp.filters = [blurFilter];
		// filters are only displayed when the display object is cached
		// later, you can call updateCache() to update changes to your filters
		bmp.cache(margins.x,margins.y,img.width+margins.width,img.height+margins.height);
		bmp.x += bmp.x+img.width;
		stage.addChild(bmp);


		var greyScaleFilter = new ColorMatrixFilter([
			0.33,0.33,0.33,0,0, // red
			0.33,0.33,0.33,0,0, // green
			0.33,0.33,0.33,0,0, // blue
			0,0,0,1,0  // alpha
		]);
		bmp = bmp.clone();
		bmp.filters = [greyScaleFilter];
		bmp.cache(0,0,img.width,img.height); // color filters don't change the bounds.
		bmp.y += bmp.y+img.height;
		stage.addChild(bmp);


		var removeRedFilter = new ColorFilter(0,1,1,1); // red, green, blue, alpha
		bmp = bmp.clone();
		bmp.filters = [removeRedFilter];
		bmp.cache(0,0,img.width,img.height); // color filters don't change the bounds.
		bmp.x = (canvas.width-2*img.width)/3;
		stage.addChild(bmp);

		// draw to the canvas:
		stage.update();
	}
	// --------- /Component Private API --------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("FilterChart",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.FilterChart();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
