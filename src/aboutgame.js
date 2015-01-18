/*
 * 关于
 */

var AboutGameLayer = cc.Layer.extend({
	isMouseDown:false,
	helloImg:null,
	helloLabel:null,
	circle:null,
	sprite:null,

	ctor:function () {
		this._super();
		var size = cc.director.getWinSize();
		var layer = cc.Layer.create();
		//背景
		var bg = cc.Sprite.create(play_background_png);
		bg.attr({
			x: size.width / 2,
			y: size.height / 2,
		});
		layer.addChild(bg);
		//人物
		var person = cc.Sprite.create(character,cc.rect(49,0,49,83));
		person.x = size.width /2;
		person.y = size.height / 2.0 + person.height;
		person.anchorX = 0.5;
		person.anchorY = 0.5;
		layer.addChild(person);
		var about_label = new cc.LabelTTF("关于", "Arial", 20, cc.size(cc.winSize.width*0.8, 40), cc.TEXT_ALIGNMENT_CENTER);
		about_label.setColor(cc.color(0, 0, 0));	
		about_label.x = size.width / 2.0;
		about_label.y = size.height / 2.0;
		layer.addChild(about_label);
		
		var about_info_label = new cc.LabelTTF("潜入敌后\n努力不让敌人的追光灯发现你\n潜伏时间超过5秒会失去一个生命", "Arial", 20, cc.size(cc.winSize.width*0.8, 80), cc.TEXT_ALIGNMENT_CENTER);
		about_info_label.setColor(cc.color(0, 0, 0));	
		about_info_label.x = size.width / 2.0;
		about_info_label.y = size.height / 2.0 - 60 ;
		layer.addChild(about_info_label);
		var menu = cc.Menu.create();
		menu.setPosition(cc.p(0, 0));
		layer.addChild(menu);
		//返回
		var backButton = cc.MenuItemImage.create(backtotopnormal,backtotoppressed,
				function(){ 
			this.touchBackGame();
		},this);
		backButton.x = size.width / 2.0;
		backButton.y = size.height / 2.0 - 160;
		menu.addChild(backButton);
		var back_label = new cc.LabelTTF("返回", "Arial", 25, cc.size(cc.winSize.width*0.8, 25), cc.TEXT_ALIGNMENT_CENTER);
		back_label.x = size.width / 2.0;
		back_label.y = size.height / 2.0 - 160;
		back_label.scale = 0.8;
		layer.addChild(back_label);
		this.addChild(layer);
		return true;
	},
	touchBackGame:function(){
			var scene = cc.Scene.create();
			var layer = new StartGameLayer();
			scene.addChild(layer);
			var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
			cc.director.runScene(transition);
	}

});
