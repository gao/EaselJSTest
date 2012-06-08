var smr = smr || {};

(function($){
	
	// --------- Component Private Properties --------- //
	var canvas;
	var stage;

	var offset = new Point();
	var target;
	var target2;
	var container;
	var ref;
	// --------- /Component Private Properties --------- //

	// --------- Component Interface Implementation ---------- //
	function Matrix(){};
	smr.Matrix = Matrix; 
  
	Matrix.prototype.build = function(data,config){
		var html = $("#tmpl-Matrix").render({});
		return $(html);
	}
		
	Matrix.prototype.postDisplay = function(data, config) {
		var $e = this.$element;
		var c = this;
		
		var canvas = $e.find("#MatrixCanvas")[0];
		stage = new Stage(canvas);
		
		// toss a shape on stage to show what it looks like untransformed:
		ref = new Shape();
		stage.addChild(ref);
		ref.x = ref.y = 60;
		ref.graphics.beginFill("#888").drawRect(-50,-50,100,100).beginFill("#777").drawRect(0,-1,60,2);


		// create a container (equivalent to a Sprite)
		container = new Container();
		stage.addChild(container);

		container.x = 100;
		container.y = 50;
		container.scaleX = 1;
		container.skewX = -39;

		// create the target we will try to match:
		target = new Shape();
		container.addChild(target);
		target.graphics.beginFill("#F00").drawRect(-50,-50,100,100).beginFill("#777").drawRect(0,-1,60,2);

		target.scaleX = -1;
		target.skewY = 17;
		target.x = target.y = 100;
		target.rotation = 30;

		test();
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- /Component Private API --------- //
	function test() {
		// create another identical looking target to overlay:
		target2 = new Shape();
		target2.graphics.beginFill("#00F").drawRect(-50,-50,100,100).beginFill("#777").drawRect(0,-1,60,2);
		stage.addChild(target2);

		var mtx = target.getConcatenatedMatrix();
		mtx.decompose(target2);
		target2.y += 100;

		target.onPress = function(evt) { alert("Clicked the red shape"); }

		stage.update();
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("Matrix",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.Matrix();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
