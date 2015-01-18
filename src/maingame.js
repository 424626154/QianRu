/**
 * 游戏主场景
 */
/*游戏层级*/
var MainGameLayer = cc.Layer.extend({
	bg1:null,
	bg2:null,
	enemy:null,
	winSize:null,
	person:null,
	child_type:{child_bg:1,child_sprite :2,child_menu :3},
	enemyArray:null,//敌人数组
	game_layer:null,
	countdown_num:null,
	countdown_laber:null,
	audioEngine:null,
	m_label:null,
	person_speed:null,
	game_state_enu :{game_start:1,game_run:2,game_over:3},// 1 开始游戏 2 游戏中 3 游戏结束
	game_state : null,
	b_move:null,
	test:null,
	life_num:null,
	life_time:null,
	life_image:null,
	life_lable:null,
	bloods:null,
	ctor:function () {
		this._super();
		game_layer = this;
		this.winSize = cc.director.getWinSize();
		/*音乐播放*/
		this.audioEngine = cc.audioEngine;
		this.enemyArray = new Array();
		this.bloods = new Array();
		this.person_speed = 2;
		current_from = 0;
		this.b_move = true;
		/*初始化背景*/
		this.initBg();
		
		/*初始化人物*/
		this.initPerson();	
//		/*初始化数字标签*/
		this.initNumber();
//		/*初始化倒计时*/
		this.initCountdown();
		this.initLife();
		return true;
	},
	/**
	 * 初始化背景
	 */
	initBg:function(){
		this.bg1 = cc.Sprite.create(play_background_png);
		this.bg1.setAnchorPoint(cc.p(0, 0));
		this.bg1.setPosition(cc.p(0, 0));
		this.addChild(this.bg1,this.child_type.child_bg);
		this.bg2 = cc.Sprite.create(play_background_png);
		this.bg2.setAnchorPoint(cc.p(0, 0));
		this.bg2.setPosition(cc.p(0, this.bg2.getContentSize().height));
		this.addChild(this.bg2,this.child_type.child_bg);
	},
	/**
	 * 初始化人物
	 */
	initPerson:function(){
		this.person = cc.Sprite.create(character,cc.rect(49,0,49,83));
		this.person.setAnchorPoint(cc.p(0.5,0.5));
		this.person.setPosition(cc.p(this.winSize.width/2, this.person.height));
		this.addChild(this.person, this.child_type.child_sprite);
	},
	/**
	 * 背景移动
	 */
	backgroundMove:function(){
		if(!this.b_move){
			return;
		}
		if(this.person.getPositionY() < this.winSize.height/2){
			this.person.setPositionY(this.person.getPositionY()+this.person_speed);
		}else{
			this.bg1.setPositionY(this.bg1.getPositionY()-this.person_speed);  
			this.bg2.setPositionY(this.bg1.getPositionY()+this.bg1.getContentSize().height);  
			if (this.bg2.getPositionY()==0)//要注意因为背景图高度是842，所以每次减去2最后可以到达0，假如背景高度是841，那么这个条件永远达不到，滚动失败  
			{  
				this.bg1.setPositionY(0);  
			} 
		}
		if(this.enemyArray.length > 0){
			for (var i = this.enemyArray.length - 1; i >=  0; i --) {
				var enemy = this.enemyArray[i];
				var enymy_round_x;
				var enymy_round_y;
				var distance ;
				if(enemy.getType() == 0){
					enymy_round_x = enemy.getPositionX()+(enemy.width-35)*Math.cos(2*Math.PI/360*enemy.getRotation());
					enymy_round_y = enemy.getPositionY()-(enemy.width-35)*Math.sin(2*Math.PI/360*enemy.getRotation());
//					cc.log(enymy_round_y);

				}else if(enemy.getType() == 1){
					if(enemy.getRotation()>0){
						enymy_round_x = this.winSize.width-(enemy.width-35)*Math.cos(2*Math.PI/360*(enemy.getRotation()));
					}else{
						enymy_round_x = this.winSize.width-(enemy.width-35)*Math.cos(2*Math.PI/360*(-enemy.getRotation()));
					}

					enymy_round_y = enemy.getPositionY()+(enemy.width-35)*Math.sin(2*Math.PI/360*enemy.getRotation());
				}
				distance = cc.pDistance(this.person.getPosition(),cc.p(enymy_round_x, enymy_round_y)); 
				if(distance < 40){
					this.death();
				}

				if(enemy.getPositionY() > 0){
					if(this.person.getPositionY() >= this.winSize.height/2){						
						enemy.setPositionY(enemy.getPositionY()-this.person_speed); 
					}
				}else{
					this.removeChild(enemy,true);
					this.enemyArray.splice(i,1);
//					cc.log(this.enemyArray.length);
				}

			}
		}
		current_from += this.person_speed;
		var meter = current_from + "米";
		this.m_label.setString(meter);
		this.aiEnemy();
	},
	/**
	 * 生产敌人
	 */
	createEnemy:function(){				
		if(!this.b_move){
			return;
		}
		var type  = Math.round(Math.random());
		var enemy = Enemy.create(this.game_layer,type);
		this.addChild(enemy,this.child_type.child_sprite);
		this.enemyArray.push(enemy);
//		cc.log("创建敌人");
	},
	aiEnemy:function(){
		var num = 0;
		num = Math.floor(current_from/1000)+1;
//		cc.log(num);
		var num1 = Math.floor(this.winSize.height/(4+num))*2;
//		cc.log(num1);
		if(current_from%(num1) == 0){
			this.createEnemy();
//			cc.log("创建怪物 ："+current_from+"__"+Math.floor(this.winSize.height/6)*2);
		}
	},
	//倒计时
	initCountdown:function(){
		this.countdown_num = 3;
		this.countdown_laber = new cc.LabelTTF(this.countdown_num+"", "Arial", 60, cc.size(60, 60), cc.TEXT_ALIGNMENT_CENTER);
		this.addChild(this.countdown_laber, this.child_type.child_menu);
		this.countdown_laber.x = this.winSize.width/2;
		this.countdown_laber.y = this.winSize.height/2;
		this.countdown_laber.anchorX = 0.5;
		this.countdown_laber.anchorY = 0.5;
		this.countdown_laber.setColor(cc.color(0, 0, 0));	
		this.schedule(this.onCountdownUpdate, 1.0);
	},
	onCountdownUpdate:function(dt){
		this.countdown_laber.setString(this.countdown_num+"");
		this.countdown_num --;
		if(this.countdown_num <= -1){
			this.removeChild(this.countdown_laber, true);
			this.unschedule(this.onCountdownUpdate);
			this.startGame();
		}
	},
	/**
	 * 初始化数字标签
	 */
	initNumber:function(){
		this.m_label= new cc.LabelTTF("0米", "Arial", 60, cc.size(this.winSize.width, 60), cc.TEXT_ALIGNMENT_CENTER);
		this.addChild(this.m_label, this.child_type.child_menu);
		this.m_label.x = 0;
		this.m_label.y = this.winSize.height;
		this.m_label.anchorX = 0;
		this.m_label.anchorY = 1;
		this.m_label.setColor(cc.color(0, 0, 0));	
	},
	startGame:function(){


		var type  = Math.round(Math.random());
		var enemy = new Enemy(game_layer,type);
		if(type == 0){
			enemy.setAnchorPoint(cc.p(0, 0.5));
			enemy.setPosition(cc.p(0, game_layer.winSize.height/2));
		}else if(type == 1){
			enemy.flippedX = true;
			enemy.setAnchorPoint(cc.p(1, 0.5));
			enemy.setPosition(cc.p(game_layer.winSize.width, game_layer.winSize.height/2));
		}
		this.addChild(enemy,this.child_type.child_sprite);
		this.enemyArray.push(enemy);

		this.schedule(this.backgroundMove, 0.01);
		var person_rect = [
		                   cc.rect(49,0,49,83),
		                   cc.rect(0,182,53,73),
		                   cc.rect(55,178,39,77),
		                   cc.rect(0,91,41,89),
		                   cc.rect(0,0,47,89),
		                   cc.rect(100,0,65,69),
		                   cc.rect(92,85,49,81),
		                   cc.rect(43,91,47,85)
		                   ];
		var paths = [];
		var frame;
		var str = "";
		/*人物爬行*/
		for (var i = 0; i < 8; i++) {
			str = "character_" + (i+1)+ ".png";
			frame = cc.SpriteFrame.create(character,person_rect[i]);
			paths.push(frame);
		}
		var prrson_run_animation = cc.Animation.create(paths, 0.06);
		paths = [];
		this.person.runAction(cc.Animate.create(prrson_run_animation).repeatForever());
		/*屏幕触摸监听*/
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded,
			onTouchCancelled: this.onTouchCancelled
		}, this);
		this.game_state = this.game_state_enu.game_run;
		this.playMusic();
	},
	peson_stop:function(){
		this.b_move = false;
		this.person.stopAllActions();	
		var paths = [];
		var frame;
		var str = "";


		var person_stop_rect = [
		                        cc.rect(236,0,42,43),
		                        cc.rect(172,0,62,63)
		                        ];
		//蜘蛛网
//		for (var i = 0; i < 2; i++) {
//			str = "web_big_" + (i+1)+ ".png";
//			frame = cc.SpriteFrame.create(animations,person_stop_rect[i]);
//			paths.push(frame);
//		}
		paths.push(cc.SpriteFrame.create(yincang0_png,cc.rect(0,0,50,84)));
		paths.push(cc.SpriteFrame.create(yincang1_png,cc.rect(0,0,50,84)));
//		cc.log(paths.length);
		var prrson_stop_animation = cc.Animation.create(paths, 0.5);
		paths = [];
		this.person.runAction(cc.Animate.create(prrson_stop_animation).repeatForever());
		this.life_time  = 5;
//		this.schedule(this.onLifeUpdate, 1.0);
		for(var i = this.bloods.length - 1; i >=  0; i --){
			var blood = this.bloods[i];
			this.removeChild(blood,true);
			this.bloods.splice(i,1);	
		}
		this.subBlood();
	},
	peson_run:function(){
		this.b_move = true;
		this.person.stopAllActions();	
		var paths = [];
		var frame;
		var str = "";
		var person_rect = [
		                   cc.rect(49,0,49,83),
		                   cc.rect(0,182,53,73),
		                   cc.rect(55,178,39,77),
		                   cc.rect(0,91,41,89),
		                   cc.rect(0,0,47,89),
		                   cc.rect(100,0,65,69),
		                   cc.rect(92,85,49,81),
		                   cc.rect(43,91,47,85)
		                   ];
		/*人物爬行*/
		for (var i = 0; i < 8; i++) {
			str = "character_" + (i+1)+ ".png";
			frame = cc.SpriteFrame.create(character,person_rect[i]);
			paths.push(frame);
		}
		var prrson_run_animation = cc.Animation.create(paths, 0.06);
		paths = [];
		this.person.runAction(cc.Animate.create(prrson_run_animation).repeatForever());
		this.unschedule(this.onLifeUpdate());
	},
	death:function(){
		this.game_state = this.game_state_enu.game_over;
		this.person.stopAllActions();
		//死亡
		var paths = [];
		var frame;
		var str = "";
		//蜜蜂
		var voer1_rect = [cc.rect(0,0,83,84),
		                  cc.rect(0,86,85,76),cc.rect(85,0,85,76)];
//		for (var i = 0; i < 3; i++) {
//			str = "ani_bee_" + (i+1)+ ".png";
//			frame =  cc.SpriteFrame.create(animations,voer1_rect[i]);
//			paths.push(frame);
//		}
		paths.push(cc.SpriteFrame.create(zidan1_png,cc.rect(0,0,50,84)));
		paths.push(cc.SpriteFrame.create(zidan2_png,cc.rect(0,0,50,84)));
		paths.push(cc.SpriteFrame.create(zidan3_png,cc.rect(0,0,50,84)));
		var voer1_animetion = cc.Animation.create(paths, 0.2);
		paths = [];
		/*倒立*/
		var voer2_rect = [cc.rect(149,78,55,74),
		                  cc.rect(75,164,63,80),cc.rect(0,164,73,80)];
		for (var i = 0; i < 3; i++) {
			str = "ani_hang_" + (i+1)+ ".png";
			frame =  cc.SpriteFrame.create(animations,voer2_rect[i]);
			paths.push(frame);
		}

		var voer2_animetion = cc.Animation.create(paths, 0.1);
		paths = [];
		var over_seq = cc.Sequence.create(cc.Animate.create(voer1_animetion),
				cc.Animate.create(voer2_animetion),
				cc.CallFunc.create(this.siwangMussic(this)),
				cc.DelayTime.create(1),
				cc.CallFunc.create(this.deathEnd));
		this.person.runAction(over_seq);
		this.b_move = false;

		this.stopMusic();
		this.playDieMusic();
		this.unschedule(this.onLifeUpdate());
	},
	deathEnd:function(){
		var scene = cc.Scene.create();
		var layer = new RestartGameLayer();
		scene.addChild(layer);
		var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
		cc.director.runScene(transition);
	},
	playMusic:function () {
		this.audioEngine.playMusic(background_mp3, true);
	},
	stopMusic:function () {
		this.audioEngine.stopMusic();
	},
	siwangMussic:function (layer) {
		this.siwang_music_id = layer.audioEngine.playEffect(siwang);
	},
	playDieMusic:function(){
		this,die_music_id = this.audioEngine.playEffect(qiangsheng);
	},
	stopDieMusic:function(){
		this,audioEngine.stopEffect(die_music_id);
		this,audioEngine.stopEffect(siwang_music_id);
	},
	onTouchBegan:function(touch, event) {
		var pos = touch.getLocation();
		var id = touch.getId();
		if(event.getCurrentTarget().game_state == event.getCurrentTarget().game_state_enu.game_run){
//			cc.log("onTouchBegan");
			event.getCurrentTarget().peson_stop();			
		}	
		return true;
	},
	onTouchMoved:function(touch, event) {
		var pos = touch.getLocation();
		var id = touch.getId();
	},

	onTouchEnded:function(touch, event) {
		var pos = touch.getLocation();
		var id = touch.getId();
		if(event.getCurrentTarget().game_state == event.getCurrentTarget().game_state_enu.game_run){
			event.getCurrentTarget().peson_run();
		}
	},
	onTouchCancelled:function(touch, event) {
		var pos = touch.getLocation();
		var id = touch.getId();
	},
	initLife:function(){
		this.life_time = 5;
		this.life_num = 5;
		//生命
		this.life_lable = new cc.LabelTTF(this.life_num+"", "Arial", 60, cc.size(60, 60), cc.TEXT_ALIGNMENT_CENTER);
		this.addChild(this.life_lable, this.child_type.child_menu);
		this.life_lable.x = this.winSize.width-60;
		this.life_lable.y = this.winSize.height;
		this.life_lable.anchorX = 0;
		this.life_lable.anchorY = 1;
		this.life_lable.setColor(cc.color(0, 0, 0));	

		this.life_image = cc.Sprite.create(character,cc.rect(49,0,49,83));
		this.life_image.setAnchorPoint(cc.p(0,1));
		this.life_image.setPosition(cc.p(this.winSize.width-95, this.winSize.height));
		this.addChild(this.life_image, this.child_type.child_sprite);

	},
	onLifeUpdate:function(){
		this.life_time -= 1;
		if(this.life_time <= 0){
			this.life_time = 5;
			this.life_num -= 1;
			this.life_lable.setString(this.life_num);
			if(this.life_num <= 0){
//				this.death();
			}
		}
	},
	//减血提示
	subBlood:function(){
		var blood = new cc.LabelTTF(this.life_time+"", "Arial", 30, cc.size(60, 60), cc.TEXT_ALIGNMENT_CENTER);
		blood.setColor(cc.color(255, 0, 0));
		blood.x = this.person.x;
		blood.y = this.person.y-20;
		this.addChild(blood,this.child_type.child_menu);
		blood.runAction(cc.Sequence.create(cc.ScaleTo.create(1.0, 2, 2),cc.CallFunc.create(this.romeveBlood, this)));
		this.bloods.push(blood);
	},
	romeveBlood:function(){
		if (this.b_move) {
			for(var i = this.bloods.length - 1; i >=  0; i --){
				var blood = this.bloods[i];
				this.removeChild(blood,true);
				this.bloods.splice(i,1);	
			}
			return;
		}
		this.life_time -= 1;
		if(this.bloods.length > 0){
			var blood = this.bloods[this.bloods.length - 1];
			this.removeChild(blood,true);
			this.bloods.splice(this.bloods.length - 1,1);			
		}
		if(this.life_time <= 0){
			this.life_time = 5;
			this.life_num -= 1;
			this.life_lable.setString(this.life_num);
			if(this.life_num <= 0){
				for(var i = this.bloods.length - 1; i >=  0; i --){
					var blood = this.bloods[i];
					this.removeChild(blood,true);
					this.bloods.splice(i,1);	
				}
				this.death();
				
			}else{
				this.subBlood();
			}
		}else {
			this.subBlood();
		}
	}
	
});
var Enemy = cc.Sprite.extend({
	game_layer:null,
	max_angle:null,
	add_angle:null,
	type:null,//0 左 1 右
	ctor:function(game_layer,type){
		this._super();
		this.initWithFile(light_png);
		this.type = type;
		this.max_angle = 70;
		this.add_angle = 20;
		var to  = cc.RotateTo.create(1,this.max_angle);
		var to1  = cc.RotateTo.create(1,-this.max_angle);
		this.runAction(cc.Sequence.create(to, cc.DelayTime.create(0.25), cc.CallFunc.create(this.enemyMoveAi, this))); 
		return true;
	},
	enemyMoveAi:function(){
//		cc.log(this.getRotation());
		var to  = cc.RotateTo.create(2,this.max_angle);
		var to1  = cc.RotateTo.create(2,-this.max_angle);
		if (this.getRotation() >= 0) {
			this.runAction(cc.Sequence.create(to1, cc.DelayTime.create(0.25), cc.CallFunc.create(this.enemyMoveAi, this)));
		}else{
			this.runAction(cc.Sequence.create(to, cc.DelayTime.create(0.25), cc.CallFunc.create(this.enemyMoveAi, this)));
		}
	},
	getType:function(){
		return this.type;
	}
});
Enemy.create = function(person,type){
	var enemy = new Enemy(game_layer,type);
	if(type == 0){
		enemy.setAnchorPoint(cc.p(0, 0.5));
		enemy.setPosition(cc.p(0, game_layer.winSize.height));
	}else if(type == 1){
		enemy.flippedX = true;
		enemy.setAnchorPoint(cc.p(1, 0.5));
		enemy.setPosition(cc.p(game_layer.winSize.width, game_layer.winSize.height));
	}

	return enemy;
}
