var smr = smr || {};

(function($){

	// --------- Component Private Properties --------- //
	var img;
	var canvas;
	var stage;
	var bmp;
    var DELTA_INDEX;
    var blurXSlider;
    var blurFilter, hueFilter, constrastFilter, saturationFilter, brightnessFilter;
    var redChannelFilter, greenChannelFilter, blueChannelFilter;
    var colorFilter;
    var slideInterval = -1;
    var cm;
	// --------- /Component Private Properties --------- //
	
	// --------- Component Interface Implementation ---------- //
	function Filter2Chart(){};
	smr.Filter2Chart = Filter2Chart; 
  
	Filter2Chart.prototype.build = function(data,config){
		var html = $("#tmpl-Filter2Chart").render({});
		return $(html);
	}
		
	Filter2Chart.prototype.postDisplay = function(pdata, config) {
		var $e = this.$element;
		var thisC = this;
		
		//wait for the image to load
		img = new Image();
		img.onload = handleImageLoad;
		img.src = "css/images/flowers_small.jpg";
		
		canvas = $e.find("#Filter2ChartCanvas")[0];

		// create a new stage and point it at our canvas:
		stage = new Stage(canvas);
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Private API --------- //
	function handleImageLoad() {
        bmp = new Bitmap(img);
        bmp.scaleX = bmp.scaleY = 2;
        bmp.cache(0,0,img.width,img.height);
        stage.addChild(bmp);

        $(".brightnessSlider").slider({
            value: 0,
            min: -100,
            max: 100,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".saturationSlider").slider({
            value: 0,
            min: -100,
            max: 100,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".contrastSlider").slider({
            value: 0,
            min: -100,
            max: 100,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".hueSlider").slider({
            value: 0,
            min: -100,
            max: 100,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".blurYSlider").slider({
            value: 0,
            min: 0,
            max: 30,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".blurXSlider").slider({
            value: 0,
            min: 0,
            max: 30,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".redChannelSlider").slider({
            value: 255,
            min: 0,
            max: 255,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".greenChannelSlider").slider({
            value: 255,
            min: 0,
            max: 255,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $(".blueChannelSlider").slider({
            value: 255,
            min: 0,
            max: 255,
            disabled:false,
            change:handleChange,
            slide: handleSlide
        });

        $("#resetBtn").click(handleReset);

        applyEffect();
    }

    function handleSlide() {
        if (slideInterval == -1) {
	        slideInterval = setInterval(applyEffect, 250);
        }
    }

    function handleChange() {
        clearInterval(slideInterval);
        slideInterval = -1;
        applyEffect();
    }

    function applyEffect() {
        var brightnessValue = $(".brightnessSlider").slider("option", "value");
        var contrastValue =  $(".contrastSlider").slider("option", "value");
        var saturationValue =  $(".saturationSlider").slider("option", "value");
        var hueValue = $(".hueSlider").slider("option", "value");

        var blurXValue = $(".blurXSlider").slider("option", "value");
        var blurYValue = $(".blurYSlider").slider("option", "value");

        var redChannelvalue = $(".redChannelSlider").slider("option", "value");
        var greenChannelValue = $(".greenChannelSlider").slider("option", "value");
        var blueChannelValue = $(".blueChannelSlider").slider("option", "value");

        cm = new ColorMatrix();
        cm.adjustColor(brightnessValue, contrastValue, saturationValue, hueValue);

        colorFilter = new ColorMatrixFilter(cm);
        blurFilter = new BoxBlurFilter(blurXValue,  blurYValue, 2);
        redChannelFilter = new ColorFilter(redChannelvalue/255,1,1,1);
        greenChannelFilter = new ColorFilter(1,greenChannelValue/255,1,1);
        blueChannelFilter = new ColorFilter(1,1,blueChannelValue/255,1);

        updateImage();
    }

    function handleReset() {
        $(".brightnessSlider").slider("option", "value", 0);
        $(".saturationSlider").slider("option", "value", 0);
        $(".hueSlider").slider("option", "value", 0);
        $(".blurYSlider").slider("option", "value", 0);
        $(".blurXSlider").slider("option", "value", 0);
        $(".contrastSlider").slider("option", "value", 0);
        $(".redChannelSlider").slider("option", "value", 255);
        $(".greenChannelSlider").slider("option", "value", 255);
        $(".blueChannelSlider").slider("option", "value", 255);

        applyEffect();
    }

    function updateImage() {
        bmp.filters = [colorFilter, blurFilter, redChannelFilter, greenChannelFilter, blueChannelFilter];
        bmp.updateCache();
        stage.update();
    }
	// --------- /Component Private API --------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("Filter2Chart",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.Filter2Chart();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
