var scenes = null;
window.onload = function() {
    
    Crafty.init(640, 640);
    Crafty.viewport.init(400, 400);
    //Crafty.modules({ 'crafty-debug-bar': 'release' }, function () {
    //    Crafty.debugBar.show();
    //});
    scenes = Crafty.scene("loading");
    
    
    
}