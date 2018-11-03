//Igrac, cela klasa je ovde
Crafty.c("Player", {
    health: 0,
    distance: 0,
    projSpeed: 0,
    fireSpeed: 0,
    fireState: false,
    inventory: new Array(),
    equipment: {weapon: null, armor: null, shield: null},
    
    Player: function(health, fireSpeed, distance, prSpeed) {
        this.health = health;
        this.fireSpeed = fireSpeed * 10;
        this.distance = distance;
        this.projSpeed = 100-(100-prSpeed*10);
        
        this.requires("SpriteAnimation, Collision, Grid, WiredHitBox, Delay")
            .animate("walk_up", 0, 0, 2)
            .animate("walk_down", 0, 1, 2)
            .animate("walk_left", 0, 2, 2)
            .animate("walk_right", 0, 3, 2)
            .bind("NewDirection", function (direction) {
                if (direction.x < 0) {
                    if (!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10, -1);
                    this._movement.facing = -1;
                }
                if (direction.x > 0) {
                    if (!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 10, -1);
                    this._movement.facing = 1;
                }
                if (direction.y < 0) {
                    if (!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 10, -1);
                    this._movement.facing = -2;
                }
                if (direction.y > 0) {
                    if (!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 10, -1);
                    this._movement.facing = 2;
                }
                if(!direction.x && !direction.y) {
                    this.stop();
                }     
            })
            .bind("Moved", function(from){
                if(this.hit('solid')){
                    //console.log("hit");
                    this.attr({x: from.x, y:from.y});
                }
                adjustViewport(this, 640, 640);
            })
            //Naci nacin za prosledjivanje dimenzija projektila
            .bind("Fire", function(e){
                console.log(e);
                if(this.fireState == false)
                {
                    if(this._movement.facing == 1)
                    {
                        var temp = Crafty.e("2D, DOM, Tween, Projectile, arrow")
                                    .attr({x: this._x + this._w + this._w/2, y: this._y + this._h/2 - 3, z: 1, rotation: 90})
                                    .tween({x: this._x + this.distance}, this.projSpeed)
                                    .projectile(50, 12, this.fireSpeed);
                        console.log(temp);
                                    
                        this.fireState = true;    
                        this.delay(function() {
                            this.fireState = false;},
                            this.fireSpeed);
                    }
                    if(this._movement.facing == -1)
                    {
                        Crafty.e("2D, Tween, DOM, Projectile, arrow")
                                    .attr({x: this._x - this._w/2, y: this._y + this._w/2 + 3, z: 1, rotation: 270})
                                    .tween({x: this._x - this.distance}, this.projSpeed)
                                    .projectile(50, 12);
                        
                        this.fireState = true;    
                        this.delay(function() {
                            this.fireState = false;},
                            this.fireSpeed);
                    }
                    if(this._movement.facing == 2)
                    {
                        Crafty.e("2D, Tween, DOM, Projectile, arrow")
                                    .attr({x: this._x + this._w/2 + 3, y: this._y + this._h + this._h/2, z: 1, rotation: 180})
                                    .tween({y: this._y + this.distance}, this.projSpeed)
                                    .projectile(50, 12);
                        
                        this.fireState = true;    
                        this.delay(function() {
                            this.fireState = false;},
                            this.fireSpeed);
                    }
                    if(this._movement.facing == -2)
                    {
                        Crafty.e("2D, Tween, DOM, Projectile, arrow")
                                    .attr({x: this._x + this._w/2 - 3, y: this._y - this._h/2, z: 1, rotation: 0})
                                    .tween({y: this._y - this.distance}, this.projSpeed)
                                    .projectile(50, 12);
                        this.fireState = true;    
                        this.delay(function() {
                            this.fireState = false;},
                            this.fireSpeed);
                    }
                }            
            })
            
            
        adjustViewport(this, 640, 640);
        return this;
    }
});

Crafty.c("Projectile", {
    dmg: 0,
    speed: 0,

    init: function() {
        this.requires("2D, DOM, Sprite, Collision, Delay")
    },
    
    projectile: function(dmg, speed){
        this.dmg = dmg;
        this.speed = speed;
        this.bind("TweenEnd", function() {
            this.destroy();
        });
        this.bind("TweenChanged", function(e){
            if((e == "x" || e == "y"))
            {
                this.onHit("solid", function(){this.destroy()});
                this.onHit("Enemy", function(e){
                    this.destroy();
                    for(var i=0; i<e.length; i++)
                    {
                        e[i].obj.trigger("Dmg", this.dmg);
                    }
                });
            }
        })
        
        return this;
    }
});

//Controls
Crafty.c("LeftControls", {
        init: function() {
            this.requires('Multiway, KeyBoard');
        },
        
        leftControls: function (speed)
        {
            this.multiway(speed, {W: -90, S:90, D:0, A:180})
            //this.multiway(speed*3, {W:-90})
            
            this.bind("KeyDown", function(e) {
                console.log(e.key);
                if(e.key == Crafty.keys["SPACE"])
                    this.trigger("Fire");
            })
            return this;
        }
    });