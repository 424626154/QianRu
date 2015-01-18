cc.game.onStart = function(){
	cc.view.setDesignResolutionSize(480, 800, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
//	cc.LoaderScene.preload
	MyLoading.preload(g_resources, function () {
		var scene = cc.Scene.create();
		var layer = new StartGameLayer();
		scene.addChild(layer);
		var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
		cc.director.runScene(transition);
	}, this);
};
cc.game.run();