window.onload = function()
{
    Crafty.c("Fruit", {
        init: function(){ this.points = 0;},
        
        Fruit: function(points, stage){
            this.points = points;
            this.stage = stage;
            
            this.bind("EnterFrame", function(){
                if(this.y > 320)
                {
                    this.destroy();
                }
            })
            
            return this;
        }
    })
    
    Crafty.c("Basket", {
        init: function(){this.score = 0;},
        
        Basket: function(){
            this.requires("Collision, 2D, DOM, Twoway")
            .onHit("Fruit", function(){
                this.score += this.hit("Fruit")[0]["obj"].points;
                this.hit("Fruit")[0]["obj"].destroy();
                
            })
            .twoway(5);
            
            return this;
        }
    })
    
    Crafty.c("TheEye", {
        init: function() {
            this.max_fruits = 5;
            this.fruits = 0;
            
            this.score_text = Crafty.e("2D, DOM, Text")
            .attr({x: 220, y: 0, z: 1})
            .text("Score: 0")
        },
        
        TheEye: function(basket) {
            this.basket = basket;
            
            this.requires("Fruit")
            .bind("EnterFrame", function(){
                if((this.fruits < 5 && Crafty.math.randomInt(0, 1000) > 950) || this.fruits <= 0)
                {
                    var rand = Crafty.math.randomInt(0, 100);
                    
                    if(rand < 50)
                    {
                        Crafty.e("2D, DOM, Fruit, apple, Gravity")
                        .attr({x: Crafty.math.randomInt(0, 288), y: -32, z: 1})
                        .gravity()
                        .gravityConst(0.02)
                        .Fruit(10, this)
                        .bind("Remove", function(){this.stage.fruits--;console.log("Fruits:" + this.stage.fruits);})
                    }
                    if(rand >= 50 && rand < 80)
                    {
                        Crafty.e("2D, DOM, Fruit, orange, Gravity")
                        .attr({x: Crafty.math.randomInt(0, 288), y: -32, z: 1})
                        .gravity()
                        .gravityConst(0.03)
                        .Fruit(20, this)
                        .bind("Remove", function(){this.stage.fruits--;console.log("Fruits:" + this.stage.fruits);})
                    }
                    if(rand >= 80 && rand < 95)
                    {
                        Crafty.e("2D, DOM, Fruit, banana, Gravity")
                        .attr({x: Crafty.math.randomInt(0, 288), y: -32, z: 1})
                        .gravity()
                        .gravityConst(0.05)
                        .Fruit(30, this)
                        .bind("Remove", function(){this.stage.fruits--;console.log("Fruits:" + this.stage.fruits);})
                    }
                    if(rand >= 95)
                    {
                        Crafty.e("2D, DOM, Fruit, star, Gravity")
                        .attr({x: Crafty.math.randomInt(0, 288), y: -32, z: 1})
                        .gravity()
                        .gravityConst(0.07)
                        .Fruit(50, this)
                        .bind("Remove", function(){this.stage.fruits--;console.log("Fruits:" + this.stage.fruits);})
                    }
                    
                    this.fruits++;
                }
                
                this.score_text.text("Score:"+this.basket.score);
            })
            
            return this;
        }
    })
    
    Crafty.init(320, 320);
    
    Crafty.scene("loading", function(){
        Crafty.load(["fruits.png"], function(){
            Crafty.sprite(32, "fruits.png", {
                banana: [0, 0],
                orange: [1, 0],
                apple:  [2, 0],
                star:   [3, 0],
                basket: [4, 0]
            });
            
            Crafty.scene("main");
        })
    })
    
    Crafty.scene("main", function(){
        var basket = Crafty.e("2D, DOM, Basket, basket")
                            .attr({x: 160, y: 288, z: 1})
                            .Basket();
        
        var stage = Crafty.e("2D, DOM, TheEye")
                            .TheEye(basket);
    })
    
    Crafty.scene("loading");
}