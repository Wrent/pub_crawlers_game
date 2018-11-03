window.onload = function () {
    
    var map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 12, 12, 12, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 12, 12, 12, 12, 0, 0, 0, 0, 0, 48, 49, 49, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 12, 12, 54, 49, 49, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 49, 49, 49, 49, 49, 49, 0, 0, 0, 0, 0, 0, 0, 14, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 15];
    //start crafty
    Crafty.init(320, 320);
    //Crafty.canvas.init();
    
    //the loading screen that will display while our assets load
    Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete
        Crafty.load(["player.png", "block.png"], function () {
            //$.getJSON("map.json", function(data){
            //    $.each(data.layers[0]["data"], function(i, dat){
            //        map[i] = dat;
            //        console.log(map[i]);
            //    });
            Crafty.sprite(32, "player.png", {
                boy: [0, 1]
            });
    
            Crafty.sprite(16, "block.png", {
                block: [0, 0]
            });
                Crafty.scene("main"); //when everything is loaded, run the main scene
            //});
        });
    
        //black background with some loading text
        Crafty.background("#70B5FA");
        Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
                .text("Loading")
                .css({ "text-align": "center" });
    });
    
    
    
    
    var tiles = new Array();
    
    
    //Crafty.sprite(32, "ground.png", {
    //    patch_small:    [0, 0],
    //    grass:          [1, 0],
    //    patch_big:      [2, 0],
    //    dirt_top_left:  [0, 1],
    //    dirt_top:       [1, 1],
    //    dirt_top_right: [2, 1],
    //    dirt_bot_left:  [0, 3],
    //    dirt_bot:       [1, 3],
    //    dirt_bot_right: [2, 3],
    //    dirt_left:      [2, 0],
    //    dirt_right:     [2, 3],
    //    dirt_mid:       [2, 2]
    //});
    
    //automatically play the loading scene
    Crafty.scene("loading");
    
    Crafty.c("LeftControls", {
        init: function() {
            this.requires('Twoway');
        },
        
        leftControls: function (speed)
        {
            //this.multiway(speed, {W: -90, S:90, D:0, A:180})
            this.twoway(speed, speed*4)
            //this.multiway(speed*3, {W:-90})
            return this;
        }
    });
    
    Crafty.c("Boy", {
        Boy: function (){
            this.requires("SpriteAnimation, Collision, Grid, WiredHitBox")
            //.collision([2, 6], [26, 6], [26, 31], [2, 31])
            .animate("walk_left", 0, 1, 1)
            .animate("walk_right", 0, 2, 1)
            .animate("jump_left", 0, 3, 0)
            .animate("jump_right", 1, 3, 1)
            .bind("NewDirection",
                    function (direction) {
                        if(direction._up === 1)
                        {
                            if(direction.x < 0)
                            if (!this.isPlaying("jump_left"))
                                    this.stop().animate("jump_left", 10, -1);
                        
                            if(direction.x > 0)
                                if (!this.isPlaying("jump_right"))
                                        this.stop().animate("jump_right", 10, -1);
                        }
                        else
                        {
                            if (direction.x < 0) {
                                if (!this.isPlaying("walk_left"))
                                    this.stop().animate("walk_left", 10, -1);
                            }
                            if (direction.x > 0) {
                                if (!this.isPlaying("walk_right"))
                                    this.stop().animate("walk_right", 10, -1);
                            }
                            if(!direction.x && !direction.y) {
                                if(direction.facing == 1)
                                    this.stop().sprite(1, 0, 32, 32);
                                if(direction.facing == -1)
                                    this.stop().sprite(0, 0, 32, 32);
                            }
                        }
                        
                        
                })
                .bind("Jump", function(direction){
                    console.log(direction.facing)
                    if(direction.up === 1)
                    {
                        if(direction.facing < 0)
                            if (!this.isPlaying("jump_left"))
                                    this.stop().sprite(0, 3, 32, 32);
                        
                        if(direction.facing > 0)
                            if (!this.isPlaying("jump_right"))
                                    this.stop().sprite(1, 3, 32, 32);
                    }
                })
                //Zato sto Gravity trigeruje "hit" kada objekat padne
                //Prepravio u crafty.js hit u StopFalling radi preglednosti
                .bind("StopFalling", function(coords){
                    if(this.isDown("A"))
                    {
                        this.stop().animate("walk_left", 10, -1);
                    }
                    else if(this.isDown("D"))
                    {
                        this.stop().animate("walk_right", 10, -1);
                    }
                    else
                    {
                        if(this._movement.facing == 1)
                        {
                            this.stop().sprite(1, 0, 32, 32);
                        }
                        else
                        {
                            this.stop().sprite(0, 0, 32, 32);
                        }
                    }
                })
                //Osnovni collision detection da ne bi protrcavao kroz blokove
                .bind('Moved', function(from) {
                    if(this.hit('solid')){
                        console.log(this.hit('solid'));
                        this.attr({x: from.x, y:from.y});
                    }
                    if(this.hit('solid_corner')){
                        console.log(this.hit('solid'));
                        this.attr({x: from.x, y:from.y});
                    }
                    if(this.hit('solid_top')){
                        console.log(this.hit('solid'));
                        this.attr({x: from.x, y:from.y});
                    }
                })
                //.bind("EnterFrame", function(){
                //    var pos = this.pos();
                //    pos.x = pos._x;
                //    pos.y = pos._y;
                //    pos.h = pos._h;
                //    pos.w = pos._w;
                //    var q = Crafty.map.search(pos);
                //    //console.log("This: " + this + " / " + "Pos: " + pos.x + ":" + pos.y + " / " + "Search: " + q);
                //    for(var i=0; i<q.length; i++)
                //    {
                //        
                //        var obj = q[i];
                //        if(obj !== this && obj.has("solid_corner") && obj.intersect(pos))
                //        {
                //            console.log("Search: " + obj.x + ":" + obj.y + " / " + this.x + ":" + this.y + " / " + this._x + ":" + this._y);
                //            //this.x = obj.x - this.w;
                //            if(this.y - this.h < obj.y)
                //            {
                //                this.y = obj.y - this.h;
                //                break;
                //            }
                //        }
                //    }
                //})
    }
    });
    
    //Crafty.c("solid", {
    //    solid: function(){
    //        
    //    }
    //});
    
    Crafty.scene("main", function () {
        generateWorld();
        var player = Crafty.e("2D, DOM, Boy, boy, LeftControls, Gravity")
                    .attr({x:100, y:100, z: 1})
                    .leftControls(1)
                    .gravity("solid_top")
                    .Boy();
    });
    
    function generateWorld()
    {
        //Generisanje terena za RPG test
        //for(var y=0; y<18; y++)
        //{
        //    for(var x=0; x<25; x++)
        //    {
        //        var type = Crafty.math.randomInt(1, 100);
        //        if(type < 70)
        //        {
        //            Crafty.e("2D, DOM, grass").attr({x: x*32, y: y*32, z: 1});
        //        }
        //        else if(type >= 70 && type <= 90)
        //        {
        //            Crafty.e("2D, DOM, patch_small").attr({x: x*32, y: y*32, z: 1});
        //        }
        //        else if(type >= 90)
        //        {
        //            Crafty.e("2D, DOM, patch_big").attr({x: x*32, y: y*32, z: 1});
        //        }
        //    }
        //}
        
        var blocks = new Array();
        var j = 0;
        var k = 0;
        console.log("map: " + map.length);
        for(var i=0; i<map.length; i++)
        {
            //console.log(map[i]);
            if(map[i] != 0)
            {
                if(map[i] == 12)
                {
                    blocks[j++] = Crafty.e("2D, DOM, solid_top, block, WiredHitBox")
                    .attr({x:((i%20)*16), y:Math.floor((i/20))*16, z:1});
                }
                else if(map[i] == 11 || map[i] == 13 || map[i] == 14 || map[i] == 15)
                {
                    blocks[j++] = Crafty.e("2D, DOM, solid_top, block, WiredHitBox")
                    .attr({x:((i%20)*16), y:Math.floor((i/20))*16, z:1});
                }
                else
                {
                    blocks[j++] = Crafty.e("2D, DOM, solid, block, Collision, WiredHitBox")
                    .collision([0, 0], [16, 0], [16, 16], [0, 16])
                    .attr({x:((i%20)*16), y:Math.floor((i/20))*16, z:1});
                }
                
            }
            //if(collision_map[i] == 630)
            //{
            //    solid_blocks [k++] = Crafty.e("2D, DOM, solid_top")
            //    .attr({x:((i%20)*16), y:Math.floor((i/20))*16, z:1});
            //}
            
        }
    }
};