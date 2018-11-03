//Ucitava sve potrebne assets-e i za to vreme prikazuje Loading poruku
Crafty.scene("loading", function() {
    Crafty.background("#70B5FA");
    Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 280, y: 320})
         .text("Loading...")
         .css({"text-align":"center"});
         
    Crafty.load(["vivi.png", "ground.png", "arrow.png", "tile.png", "knight.png", "best.png"], function()
                {
                    Crafty.sprite(32, "vivi.png", {
                        vivi_stand_bot:     [1, 0],
                        vivi_stand_top:     [1, 1],
                        vivi_stand_left:    [1, 2],
                        vivi_stand_right:   [1, 3]
                    })
                    Crafty.sprite(32, "knight.png", {
                        Knight_stand_bot: [1, 0]
                    })
                    Crafty.sprite(1, "arrow.png", {
                        arrow: [12, 0, 7, 32]
                    })
                    Crafty.sprite(32, "ground.png", {
                        ground0_1: [0, 0],
                        ground0_2: [1, 0],
                        ground0_3: [2, 0],
                        ground0_4: [0, 1],
                        ground0_5: [1, 1],
                        ground0_6: [2, 1],
                        ground0_7: [0, 2],
                        ground0_8: [1, 2],
                        ground0_9: [2, 2],
                        ground0_10: [0, 3],
                        ground0_11: [1, 3],
                        ground0_12: [2, 3]
                    })
                    Crafty.sprite(32, "tile.png", {
                        ground1_23: [10, 0],
                        ground1_39: [10, 1],
                        ground1_40: [11, 1],
                        ground1_55: [10, 2],
                        ground1_56: [11, 2],
                        ground0_57: [12, 2]
                    })
                    Crafty.sprite(32, "best.png", {
                        hp1: [0, 0],
                        hp2: [1, 0],
                        hp3: [2, 0]
                    })
                    //Napraviti funkciju za ucitavanje mape
                    Crafty.scene("main");
                });
});

//Sadrzi svet i sve objekte u njemu, glavna scena
Crafty.scene("main", function() {
    
    var player = Crafty.e("2D, DOM, Player, vivi_stand_bot, LeftControls")
                        .attr({x: 250, y: 250, z: 1})
                        .leftControls(1)
                        .Player(3, 50, 200, 5);
    generateMap(loadMap("map.json"), "ground", player);
});

function generateMap(map, prefix, player)
{
    console.log(map);
    var blocks = new Array();
    for(var i=0; i<map.data.length; i++)
    {
        var z = parseInt(map.data[i].name);
        
        if(map.data[i].name != "Enemies")
        {
            for(var j=0; j<map.data[i].data.length; j++)
            {
                var tile_name = prefix;
                
                if(i == 0)
                {
                    tile_name = prefix;
                    switch(map.data[i].data[j]){
                        case 1:
                            tile_name = prefix + "0_1";
                            break;
                        case 2:
                            tile_name = prefix + "0_2";
                            break;
                        case 3:
                            tile_name = prefix + "0_3";
                            break;
                        case 4:
                            tile_name = prefix + "0_4";
                            break;
                        case 5:
                            tile_name = prefix + "0_5";
                            break;
                        case 6:
                            tile_name = prefix + "0_6";
                            break;
                        case 7:
                            tile_name = prefix + "0_7";
                            break;
                        case 8:
                            tile_name = prefix + "0_8";
                            break;
                        case 9:
                            tile_name = prefix + "0_9";
                            break;
                        case 10:
                            tile_name = prefix + "0_10";
                            break;
                        case 11:
                            tile_name = prefix + "0_11";
                            break;
                        case 12:
                            tile_name = prefix + "0_12";
                            break;
                        case 57:
                            tile_name = prefix + "0_57";
                            break;
                    }
                    
                    if(tile_name != prefix)
                    {
                        Crafty.e("2D, DOM, " + tile_name)
                            .attr({x:((j%map.data[i].height)*map.tile_size.y), y:Math.floor((j/map.data[i].width))*map.tile_size.y, z: z})
                    }
                }
                
                if(i == 1)
                {
                    tile_name = prefix;
                    switch(map.data[i].data[j]){
                        case 23:
                            tile_name = prefix + "1_23";
                            break;
                        case 39:
                            tile_name = prefix + "1_39";
                            break;
                        case 40:
                            tile_name = prefix + "1_40";
                            break;
                        case 55:
                            tile_name = prefix + "1_55";
                            break;
                        case 56:
                            tile_name = prefix + "1_56";
                            break;
                    }
                    
                    if(tile_name != prefix)
                    {
                        Crafty.e("2D, DOM, solid, " + tile_name)
                                .attr({x:((j%map.data[i].height)*map.tile_size.y), y:Math.floor((j/map.data[i].width))*map.tile_size.y, z: z})
                    }
                }
            }
        }
        else
        {
            for(var j=0; j<map.data[i].objects.length; j++)
            {
                var temp = map.data[i].objects[j];
                console.log(temp.properties.ms);
                var enemy = Crafty.e("2D, DOM, SpriteAnimation, " + temp.type + ", " + temp.name + "_stand_bot")
                        .attr({x: temp.x, y: temp.y, z: 1})
                        .animate("walk_up", 0, 0, 2)
                        .animate("walk_down", 0, 1, 2)
                        .animate("walk_left", 0, 2, 2)
                        .animate("walk_right", 0, 3, 2)
                        .Enemy(temp.properties.health,
                               temp.properties.armor,
                               temp.properties.dmg,
                               temp.properties.aspd,
                               temp.properties.direction,
                               parseInt(temp.properties.ms));
                        console.log(enemy._x + " : " + enemy._y)
                //setInterval(function(){enemy.trigger("EnemyMove")}, 100)
            }
        }
    }
}