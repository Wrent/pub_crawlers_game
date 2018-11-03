//Klasa za protivnike, bice naravno podesivi
Crafty.c("Enemy", {
    health: 0,
    dmg: 0,
    armor: 0,
    aspd: 0,
    direction: 'x',
    ms: 0,
    
    init: function() {
        
    },
    
    Enemy: function(hp, armor, dmg, aspd, direction, ms) {
        this.health = hp;
        this.armor = armor;
        this.dmg = dmg;
        this.aspd = aspd;
        this.direction = direction;
        this.ms = ms;
        console.log(this.ms);
        this.requires("SpriteAnimation, Collision, Grid, WiredHitBox, Delay")
            .bind("EnemyMove", function() {
                
                if(this.hit('solid'))
                {
                    if(this.direction == "x")
                    {
                        this.direction = "-x";
                    }
                    else if(this.direction == "-x")
                    {
                        this.direction = "x";
                    }
                    else if(this.direction == "y")
                    {
                        this.direction = "-y";
                    }
                    else if(this.direction == "-y")
                    {
                        this.direction = "y";
                    }
                }
                
                if(this.direction == "x")
                {
                    if (!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 10, -1);
                    this.move('e', 1);
                }
                if(this.direction == "-x")
                {
                    if (!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10, -1);
                    this.move('w', 1);
                }
                if(this.direction == "y")
                {
                    if (!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 10, -1);
                    this.move('s', 1);
                }
                if(this.direction == "-y")
                {
                    if (!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 10, -1);
                    this.move('n', 1);
                }
                if(this.direction == false)
                {
                    this.stop();
                }
                
                     
            })
            this.bind("Dmg", function(dmg) {
                    console.log("Ouch!");
                    this.health -= dmg - this.armor;
                    
                    if(this.health <= 0)
                    {
                        this.destroy();
                    }
                });
            console.log("MS: " + this.ms)
            this.interval(function(){this.trigger("EnemyMove");}, 100/this.ms);
        return this;
    }
});