window.onload = function () {
  //initialization of the framework with proper window size
  Crafty.init(640, 480);
  
  timeStarted = 0;
  
  //exact size of the "bar" area
  barWidth = 576;
  barHeight = 384; 
  //score, at which the game ends
  maxAlcoLevel = 0.3; 
  //speed of the participant
  participantSpeed = 5;
  
  
  condomIn = false;
    
  //Item component - e.g. beer, shot, deadshot
  Crafty.c("Item", {
      init: function(){ this.points = 0;},
      
      Item: function(points, stage){
      	this.points = points;
      	this.stage = stage;
        
      	return this;
      }
  }) 
  
  
  //Condom component
  Crafty.c("Condom", {
      init: function(){},
      
      Condom: function(){
        
      	return this;
      }
  })  
  
  //Block component - e.g. chairs, tables
  Crafty.c("Block", {
      init: function(){},
      
      Block: function(){
      	return this;
      }
  }) 
    
    
  //Exit component - it appears when participant reaches the maximum alcohol level 
  Crafty.c("Exit", {
          init: function(){},
          
          Exit: function(){          
              return this;
          }
      }) 
    
  //Participant component  
  Crafty.c("Participant", {
          init: function(){this.score = 0;},
          
          Participant: function(){
              this.requires("Collision, 2D, DOM, Fourway, Delay")
              //basically "drinking" function
              .onHit("Item", function(){
                  Crafty.audio.play("burp");
                  this.score += this.hit("Item")[0]["obj"].points;
                  this.hit("Item")[0]["obj"].destroy();                  
              })
              //exit function
              .onHit("Exit", function(){
                  Crafty.scene("win");           
              })
              //increase the speed temporarly
              .onHit("Condom", function(){
                  Crafty.audio.play("power");
                  this.fourway(participantSpeed + 1)
                  this.delay(function() {
                    this.fourway(participantSpeed);
                  }, 15000);           
                  this.hit("Condom")[0]["obj"].destroy();
                  condomIn = false;
              })
              //collisions with blocks
              .bind("Moved", function(from){
                if(this.hit("Block")){
                    this.attr({x: from.x, y:from.y});
                }          
              })
              .fourway(participantSpeed);
              
              
              //prevents participant from going out of the bar
              this.bind("EnterFrame", function(){
          	    if(this.y < 32)
          	     {
          		    this.y = 32;
          	     }
                 if(this.y > barHeight)
          	     {
          		    this.y = barHeight;
          	     }
                 if(this.x < 32)
          	     {
          		    this.x = 32;
          	     }
                 if(this.x > barWidth)
          	     {
          		    this.x = barWidth;
          	     }
          	   })
              
              return this;
          }
      })
    
  
  //Puking ghost component
  Crafty.c("Ghost", {
          init: function(){this.score = 0;},
          
          Ghost: function(participant){
              this.participant = participant;
              this.requires("Collision, 2D, DOM")
              
              
              .onHit("Participant", function(){
                  Crafty.audio.play("burp2");
                  //you LOSE!
                  Crafty.scene("lose")       
              })
              
              //prevents ghost from going out of the bar
              this.bind("EnterFrame", function(){
                
                var rand = Crafty.math.randomInt(0, 99);
                              
                if(rand < 75) {
                if (this.x > participant.x)
                  this.x--;
                else if(this.x < participant.x)
                  this.x++;
                  
                if (this.y > participant.y)
                  this.y--;
                else if(this.y < participant.y)
                  this.y++;     
                }
              
              
          	    if(this.y < 32)
          	     {
          		    this.y = 32;
          	     }
                 if(this.y > barHeight)
          	     {
          		    this.y = barHeight;
          	     }
                 if(this.x < 32)
          	     {
          		    this.x = 32;
          	     }
                 if(this.x > barWidth)
          	     {
          		    this.x = barWidth;
          	     }
          	   })
              
              return this;
          }
      })
    
    
  //TheEye component - main event handler
  Crafty.c("TheEye", {
    init: function() {
    
      //setting up the environment
      this.max_items = 10;
      this.items = 0;
      
      this.condomIn = false;
      
      this.blocks = 20;
      
      this.finishedDrinking = false;
            
            
      //build floor - place the texture
      for(j = 0; j < 480 - 32; j += 32){
        for(i = 0; i < 640; i += 32){
          Crafty.e("2D, DOM, floor")
            .attr({x: i, y: j, z: -1, w: 32, h:32})
        }  
      }       
            
      //build Walls - place the texture
      for(i = 0; i < 640; i += 32){
        if(i == 320 - 32){
          Crafty.e("2D, DOM, pub")
          .attr({x: i, y: 0, z: 2, w: 32, h:32});
        }
        Crafty.e("2D, DOM, wall")
          .attr({x: i, y: 0, z: 1, w: 32, h:32})
         
        
        Crafty.e("2D, DOM, wall")
          .attr({x: i, y: barHeight + 32, z: 1, w: 32, h:32})
      }    
      
      //side Walls
      for(i = 0; i <= barHeight; i += 32){
        Crafty.e("2D, DOM, wall")
          .attr({x: 0, y: i, z: 1, w: 32, h:32})
          
        Crafty.e("2D, DOM, wall")
          .attr({x: 640 - 32, y: i, z: 1, w: 32, h:32})
      }
        
            
      //generate random blocks at random positions      
      for(i = 0; i < this.blocks; i++) {        
        var randX = 0;
        var randY = 0;
        
        //this prevents spawning of blocks at the start area and at the exit area
        //basically coordinates are generated so long, until they are not right :)
        while((randX < 128 && randY < 128) || (randX < 128 && randY > 128 && randY < 256)) {
          randX = Crafty.math.randomInt(32, barWidth - 32);
          randY = Crafty.math.randomInt(32, barHeight - 32);
        }
              
        //this will determine, if the block will have table or chair texture   
        var rand = Crafty.math.randomInt(0,100);
        
        if(rand < 50)
          var type="chair";
        else
          var type="table";
        
        Crafty.e("2D, DOM, Block, "+type)
          .attr({x: randX, y: randY, z: 1, w: 32, h:32})
          .Block()
      }      
            
      //Displays the score
      this.score_text = Crafty.e("2D, DOM, Text")
        .attr({x: 10, y: 480-27, z: 1, w: 450, h: 32})
        .text("Alcohol level: 0.0 %")
        .css({"color":"white"})
      //displays the name of our game
      this.title_text = Crafty.e("2D, DOM, Text")
        .attr({x: 500, y: 480-27, z: 1, w: 200, h: 32})
        .text("The PUB Crawling")
        .css({"color":"white"})
      },
        
        
    //constuctor    
    TheEye: function(participant) {
      this.participant = participant;
      this.requires("Item")
      
        //main function handling the maximum alcohol level AND generating items
        .bind("EnterFrame", function(){
          //check the level of alcohol in participan's blood
          if(Math.round(this.participant.score*100)/100 >= maxAlcoLevel) {
            this.finishedDrinking = true;
            
            //and show the exit 
            Crafty.e("2D, DOM, Exit, exit")
              .attr({x: 10, y: 200, z: 1, w: 32, h:32})
             
             
            //and also a hint
            Crafty.e("2D, DOM, Text")
              .attr({x: 260, y: 480-27, z: 1, w: 200, h: 32})
              .text("EXIT for the next pub...")
              .css({"color":"white"})
             
          }
        
          //create new beverages
          //it will be done only when there is less than 10 items and when some random stuff is ok :)
          //if the exit is shown, there will be no more beverages
          if(((this.items < this.max_items && Crafty.math.randomInt(0, 1000) > 950) || this.items <= 0) && !this.finishedDrinking) {
              var rand = Crafty.math.randomInt(0, 100);
              
              //generate random coordinates
              var randX = Crafty.math.randomInt(32, barWidth - 32);
              var randY = Crafty.math.randomInt(32, barHeight - 32);
              
              //most common drink is beer
              if(rand < 70) {
                Crafty.e("2D, DOM, Item, Delay, beer")
                .attr({x: randX, y: randY, z: 2})
                .Item(0.002, this)
                .bind("Remove", function(){this.stage.items--;})
                //item will disappear after 5 seconds
                .delay(function() {
                  this.destroy();
                }, 5000);

                this.items++;
              }
              else if(rand >= 70 && rand < 90) {
                Crafty.e("2D, DOM, Item, Delay, shot")
                .attr({x: randX, y: randY, z: 2})
                .Item(0.007, this)
                .bind("Remove", function(){this.stage.items--;})
                //item will disappear after 5 seconds
                .delay(function() {
                  this.destroy();
                }, 5000);

                this.items++;
              } else {
                Crafty.e("2D, DOM, Item, Delay, deadShot")
                .attr({x: randX, y: randY, z: 2})
                .Item(0.01, this)
                .bind("Remove", function(){this.stage.items--;})
                //item will disappear after 5 seconds
                .delay(function() {
                  this.destroy();
                }, 5000);

                this.items++;
              }
          }      
      
          //create condom
         var rand = Crafty.math.randomInt(0, 1000);
        
        if(rand >= 999 && !condomIn){       
          //generate random coordinates
          var randX = Crafty.math.randomInt(32, barWidth - 32);
          var randY = Crafty.math.randomInt(32, barHeight - 32);
          
          
          Crafty.e("2D, DOM, Delay, Condom, condom")
                .attr({x: randX, y: randY, z: 2})
                .Condom()
                .bind("Remove", function(){condomIn = false;})
                //item will disappear after 5 seconds
                .delay(function() {
                  condomIn = false;
                  this.destroy();
                }, 5000);
                
                condomIn = true;
        }
         
        
      
        //update the score text
        this.score_text.text("Alcohol level: "+Math.round(this.participant.score*100)/100+" % / 0.3 %");
      })
        
      } 
    
    })
    
  //loading scene
  Crafty.scene("loading", function () {
      //load sprites
      Crafty.load(["sprites/beer.png", "sprites/shot.png", "sprites/deadShot.png",
                   "sprites/chair.png", "sprites/table.png", "sprites/participant.png", 
                   "sprites/wall.png", "sprites/floor.png", "sprites/pub.png", "sprites/exit.png", "sprites/ghost.png", "sprites/condom.png",
                   "sounds/burp.wav", "sounds/puke2.wav", "sounds/power.wav"
                    ], function () {
                    
          //assign sprites names          
          Crafty.sprite(32, "sprites/beer.png", {        
                beer: [0, 0]
            });
            
          Crafty.sprite(32, "sprites/shot.png", {
                shot: [0, 0]
            });
            
          Crafty.sprite(32, "sprites/deadShot.png", {
                deadShot: [0, 0]
            });
            
          Crafty.sprite(32, "sprites/chair.png", {
                chair: [0, 0]
            });
            
          Crafty.sprite(32, "sprites/table.png", {
                table: [0, 0]
            });    
        
          Crafty.sprite(32, "sprites/participant.png", {
                participantGraphics: [0, 0]
            });
            
          Crafty.sprite(32, "sprites/floor.png", {
                floor: [0, 0]
            });
            
          Crafty.sprite(32, "sprites/wall.png", {
                wall: [0, 0]
            });
      
          Crafty.sprite(32, "sprites/pub.png", {
                pub: [0, 0]
            });
          Crafty.sprite(32, "sprites/exit.png", {
                exit: [0, 0]
            });
          Crafty.sprite(1, "sprites/ghost.png", {
                ghostGraphics: [0, 0, 7, 4]
            });
          Crafty.sprite(32, "sprites/condom.png", {
                condom: [0, 0]
            });
                                                      
          Crafty.audio.add("burp", "sounds/burp.wav");
          Crafty.audio.add("burp2", "sounds/puke2.wav");
          Crafty.audio.add("power", "sounds/power.wav");
      
          //when everything is loaded, run the main scene
          Crafty.scene("start"); 
      });

      //defines the loading screen
      Crafty.background("#000");
      Crafty.e("2D, DOM, Text").attr({ w: 300, h: 100, x: 180, y: 200 })
          .text("Loading the PUB")
          .css({ "font-size": "40" })
          .css({ "color": "white" });
  });
  
  //start screen before the game - user should press any key to start
  Crafty.scene("start", function () { 
      Crafty.background("#000");
      Crafty.e("2D, DOM, Text").attr({ w: 600, h: 400, x: 30, y: 200 })
          .text("Welcome to the PUB CRAWLING.<br>Press any key to start.")          
          .css({ "text-align": "center" })
          .css({ "font-size": "40" })
          //detecting the key press
          .bind('KeyDown', function(e) {
            Crafty.scene("main");
          })
          .css({ "color": "white" });
          
  });
  
  
    //the screen, which will be shown when user wins the game
    Crafty.scene("win", function () { 
      Crafty.background("#000");
      var now = new Date();
      Crafty.e("2D, DOM, Text").attr({ w: 600, h: 400, x: 20, y: 150 })
          .text("YOU WIN!<br>Refresh for next pub...<br>Press any key to start again.<br><br>You got drunk in "
            +(Math.round((now.getTime() - timeStarted.getTime())/10)/100)+" seconds.")
          .css({ "text-align": "center" })
          .css({ "font-size": "40" })
          //detecting the key press
          .bind('KeyDown', function(e) {
            Crafty.scene("main");
            })
          .css({ "color": "white" });
  });
  
  //the screen, which will be shown when user loses the game
    Crafty.scene("lose", function () { 
      Crafty.background("#000");
      var now = new Date();
      Crafty.e("2D, DOM, Text").attr({ w: 600, h: 400, x: 20, y: 150 })
          .text("YOU LOSE!<br>Try to avoid puking next time...<br>Press any key to start again.<br><br>You survived for "
            +(Math.round((now.getTime() - timeStarted.getTime())/10)/100)+" seconds.")
          .css({ "text-align": "center" })
          .css({ "font-size": "40" })
          //detecting the key press
          .bind('KeyDown', function(e) {
            Crafty.scene("main");
            })
          .css({ "color": "white" });
  });

  //the main game scene
  Crafty.scene("main", function () {
    Crafty.audio.stop();
    Crafty.background("sprites/floor.png");
    
    timeStarted = new Date();
    
    //create the participant
    var participant = Crafty.e("2D, DOM, Color, Fourway, Participant, SpriteAnimation, participantGraphics")
    	.attr({ x: 10, y: 10, w: 32, h: 32 })
      //animation stuff
      .animate("walk_up", 0, 0, 2)                                                    
        .animate("walk_down", 0, 3, 2)
        .animate("walk_left", 0, 1, 2)
        .animate("walk_right", 0, 2, 2)
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
      .Participant();
      
   //create ghost
   var ghost = Crafty.e("2D, DOM, Ghost, SpriteAnimation, ghostGraphics")
    .attr({ x: 600, y: 350, w: 32, h: 48, z: 10 })
    //animation stuff
      .animate("walk_up", 0, 0, 7)                                                    
        .animate("walk_down", 0, 3, 7)
        .animate("walk_left", 0, 1, 7)
        .animate("walk_right", 0, 2, 7)
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
    .Ghost(participant);
    
      
   //start the event handler
   var stage = Crafty.e("2D, DOM, TheEye")
      .TheEye(participant);  
       
  }); 
  
  
  
  
  //automatically play the loading scene
  Crafty.scene("loading"); 
};