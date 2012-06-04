var smr = smr || {};

(function($){

	// --------- Component Interface Implementation ---------- //
	function HelloWorld(){};
	smr.HelloWorld = HelloWorld; 
  
	HelloWorld.prototype.build = function(data,config){
		var html = $("#tmpl-HelloWorld").render({});
		return $(html);
	}
		
	HelloWorld.prototype.postDisplay = function(pdata, config) {
		var $e = this.$element;
		var thisC = this;
		
	    var canvas = $e.find("#HelloWorldCanvas")[0];
	    var stage = new Stage(canvas);
	    
	    var text = new Text("Hello World!", "36px Arial", "#777");
	    stage.addChild(text);
		text.x = 360;
		text.y = 200;
		
	    stage.update();
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("HelloWorld",{
		emptyParent: true,
		loadTmpl: true
	},
	function(){
		return new smr.HelloWorld();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
