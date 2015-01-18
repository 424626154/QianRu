/*
 * 开始游戏
 */
var current_from = 0;
var StartGameLayer = cc.Layer.extend({
	isMouseDown:false,
	helloImg:null,
	helloLabel:null,
	circle:null,
	sprite:null,

	ctor:function () {
		this._super();
		var size = cc.director.getWinSize();
		var layer = cc.Layer.create();
		this.addChild(layer);
		var bg = cc.Sprite.create(play_background_png);
		bg.attr({
			x: size.width / 2,
			y: size.height / 2,
		});
		layer.addChild(bg);
//		//人物
		var person = cc.Sprite.create(character,cc.rect(49,0,49,83));
		person.x = size.width /2;
		person.y = size.height - 2*person.height;
		person.anchorX = 0.5;
		person.anchorY = 0.5;
		layer.addChild(person);
		
		
		var light = cc.Sprite.create(light_png);
		light.x = 10;
		light.y = size.height - 60;
		light.anchorX = 0;
		light.anchorY = 0.5;
		light.setRotation(10);
		layer.addChild(light);
		//开始按钮
		var menu = cc.Menu.create();
		menu.setPosition(cc.p(0, 0));
		layer.addChild(menu);
		var startButton = cc.MenuItemImage.create(backtotopnormal,backtotoppressed,
				function(){ 
			this.touchStartGame();
			},this);
		startButton.x = size.width / 2.0;
		startButton.y = size.height / 2.0;
		menu.addChild(startButton);
		var start_label =  new cc.LabelTTF("开始", "Arial", 25, cc.size(cc.winSize.width*0.8, 25), cc.TEXT_ALIGNMENT_CENTER);
		start_label.x = size.width / 2.0;
		start_label.y = size.height / 2.0;
		layer.addChild(start_label);

		//关于按钮
		var aboutButton = cc.MenuItemImage.create(backtotopnormal,backtotoppressed,
				function(){ 
			this.touchAboutGame();
		},this);
		aboutButton.x = size.width / 2.0;
		aboutButton.y = size.height / 2.0  - 60;
		menu.addChild(aboutButton);
		var about_label = new cc.LabelTTF("关于", "Arial", 25, cc.size(cc.winSize.width*0.8, 25), cc.TEXT_ALIGNMENT_CENTER);
		about_label.x = size.width / 2.0;
		about_label.y = size.height / 2.0 - 60 ;
		layer.addChild(about_label);
		

		return true;
	},
	touchStartGame:function(){
			var scene = cc.Scene.create();
			var layer = new MainGameLayer();
			scene.addChild(layer);
			var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
			cc.director.runScene(transition);
	},
	touchAboutGame:function(){
			var scene = cc.Scene.create();
			var layer = new AboutGameLayer();
			scene.addChild(layer);
			var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
			cc.director.runScene(transition);
	}
});
