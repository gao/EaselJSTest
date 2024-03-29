var smr = smr || {};

(function($){

	// --------- Component Private Properties --------- //
	var canvas, stage;
	var offset = new Point();
	var update = true;
	// --------- /Component Private Properties --------- //
	
	// --------- Component Interface Implementation ---------- //
	function DragDrop(){};
	smr.DragDrop = DragDrop; 
  
	DragDrop.prototype.build = function(data,config){
		var html = $("#tmpl-DragDrop").render({});
		return $(html);
	}
		
	DragDrop.prototype.postDisplay = function(pdata, config) {
		var $e = this.$element;
		var thisC = this;
		
		// create stage and point it to the canvas:
		canvas = $e.find("#DragDropCanvas")[0];

		//check to see if we are running in a browser with touch support
		stage = new Stage(canvas);

		// enable touch interactions if supported on the current device:
		Touch.enable(stage);

		// enabled mouse over / out events
		stage.enableMouseOver(10);

		// load the source image:
		var image = new Image();
		image.src = "css/images/daisy.png";
		image.onload = handleImageLoad;
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Private API --------- //
	function stop() {
		Ticker.removeListener(tick);
	}

	function handleImageLoad(event) {
		var image = event.target;
		var bitmap;
		var container = new Container();
		stage.addChild(container);

		// create and populate the screen with random daisies:
		for(var i = 0; i < 50; i++){
			bitmap = new Bitmap(image);
			container.addChild(bitmap);
			bitmap.x = canvas.width * Math.random()|0;
			bitmap.y = canvas.height * Math.random()|0;
			bitmap.rotation = 360 * Math.random()|0;
			bitmap.regX = bitmap.image.width/2|0;
			bitmap.regY = bitmap.image.height/2|0;
			bitmap.scaleX = bitmap.scaleY = bitmap.scale = Math.random()*0.4+0.6;
			bitmap.name = "bmp_"+i;

			// wrapper function to provide scope for the event handlers:
			(function(target) {
				bitmap.onPress = function(evt) {
					// bump the target in front of it's siblings:
					container.addChild(target);
					var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};

					// add a handler to the event object's onMouseMove callback
					// this will be active until the user releases the mouse button:
					evt.onMouseMove = function(ev) {
						target.x = ev.stageX+offset.x;
						target.y = ev.stageY+offset.y;
						// indicate that the stage should be updated on the next tick:
						update = true;
					}
				}
				bitmap.onMouseOver = function() {
					target.scaleX = target.scaleY = target.scale*1.2;
					update = true;
				}
				bitmap.onMouseOut = function() {
					target.scaleX = target.scaleY = target.scale;
					update = true;
				}
			})(bitmap);
		}

		Ticker.addListener(tick);
	}

	function tick() {
		// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
		if (update) {
			update = false; // only update once
			stage.update();
		}
	}
	// --------- /Component Private API --------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("DragDrop",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.DragDrop();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
