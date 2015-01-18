/*
 * 重新开始
 */

var RestartGameLayer = cc.Layer.extend({
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

		//当前记录
		var info = "潜入敌后，深入敌军内部"+current_from+"米！";
		var record_label = new cc.LabelTTF(info, "宋体", 24, cc.size(cc.winSize.width*0.8, 80), cc.TEXT_ALIGNMENT_CENTER);
		record_label.setColor(cc.color(0, 0, 0));	
		record_label.x = size.width / 2.0 ;
		record_label.y = size.height / 2.0  + 80;
		layer.addChild(record_label);
		var menu = cc.Menu.create();
		menu.setPosition(cc.p(0, 0));
		layer.addChild(menu);
		//重新开始
		var restartButton = cc.MenuItemImage.create(backtotopnormal,backtotoppressed,
				function(){ 
			this.touchRestartGame();
		},this);
		restartButton.x = size.width / 2.0;
		restartButton.y = size.height / 2.0;
		menu.addChild(restartButton);
		var restart_label = new cc.LabelTTF("重新开始", "宋体", 25, cc.size(cc.winSize.width*0.8, 25), cc.TEXT_ALIGNMENT_CENTER);
		restart_label.x = size.width / 2.0;
		restart_label.y = size.height / 2.0;
		restart_label.scale = 0.8;
		layer.addChild(restart_label);

		//退出
		var endButton = cc.MenuItemImage.create(backtotopnormal,backtotoppressed,
				function(){ 
			this.touncEndGame();
		},this);
		endButton.x = size.width / 2.0;
		endButton.y = size.height / 2.0  - 60;
		menu.addChild(endButton);
		var end_label = new cc.LabelTTF("分享", "宋体", 25, cc.size(cc.winSize.width*0.8, 25), cc.TEXT_ALIGNMENT_CENTER);
		end_label.x = size.width / 2.0;
		end_label.y = size.height / 2.0 - 60 ;
		layer.addChild(end_label);

		this.addChild(layer);

		return true;
	},
	touchRestartGame:function(){
			var scene = cc.Scene.create();
			var layer = new MainGameLayer();
			scene.addChild(layer);
			var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
			cc.director.runScene(transition);
	},
	touncEndGame:function(){
			document.title = window.wxData.desc = "潜入敌后，深入敌军内部"+current_from+"米！";
			var share = new ShareUI();
			cc.director.getRunningScene().addChild(share,15);
	},

});
var ShareUI = cc.LayerColor.extend({
	ctor: function () {
		this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

		var arrow_sprite = cc.Sprite.create(arrow);
		arrow_sprite.anchorX = 1;
		arrow_sprite.anchorY = 1;
		arrow_sprite.x = cc.winSize.width - 15;
		arrow_sprite.y = cc.winSize.height - 5;
		this.addChild(arrow_sprite);

		var label = new cc.LabelTTF("请点击右上角的菜单按钮\n然后\"分享到朋友圈\"\n测测好友的手指灵活度吧", "宋体", 18, cc.size(cc.winSize.width*0.7, 250), cc.TEXT_ALIGNMENT_CENTER);
		label.x = cc.winSize.width/2;
		label.y = cc.winSize.height - 100;
		label.anchorY = 1;
		label.shadowColor = cc.color(255,255,255);
		label.shadowBlur = 50;
		this.addChild(label);
	},
	onEnter: function () {
		this._super();
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			onTouchBegan: function (touch, event) {
				return true;
			},
			onTouchEnded:function(t, event){
				event.getCurrentTarget().removeFromParent();
			}
		}, this);
	}
});
