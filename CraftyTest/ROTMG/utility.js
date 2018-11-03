function adjustViewport(player, height, width)
{
    //console.log(player);
    var vpx = (Crafty.viewport.width/2) - player._x - player._w / 2;
    var vpy = (Crafty.viewport.height/2) - player._y - player._h / 2;
    if(vpx <= 0 && vpx <= (width - Crafty.viewport.width)){// && (-Crafty.viewport.x + Crafty.viewport.width <= 640) ){
            Crafty.viewport.x = vpx;
    }
    if(vpy <= 0 && vpy <= (height - Crafty.viewport.height)){// && (-Crafty.viewport.y + Crafty.viewport.height <= 640) ){
            Crafty.viewport.y = vpy;
    }
    if(-Crafty.viewport.x + Crafty.viewport.width > width)
    {
        Crafty.viewport.x = -(width - Crafty.viewport.width);
    }
    if(-Crafty.viewport.y + Crafty.viewport.height > height)
    {
        Crafty.viewport.y = -(height - Crafty.viewport.height);
    }
}

function loadMap(file)
{
    var map = {width: 0, height: 0, tile_size: {x: 0, y: 0}, data: new Array()};
    //getJSON je asinhron sto nam ne odgovara zbog povratne funkcije
    //$.getJSON(file, function(data){
    //    console.log(data);
    //    $.each(data.layers[0]["data"], function(i, dat){
    //        map.data[i] = dat;
    //        //console.log(dat);
    //    });
    //});
    
    //Zato se koristi sinhroni .ajax
    $.ajax({
        type: 'GET',
        url: file,
        dataType: 'json',
        success: function(data) {
            $.each(data.layers, function(i, layer)
            {
                map.data[i] = layer;
                //map.tiles.z = layer;
                //$.each(data.layers[i]["data"], function(j, dat){
                //   map.data[i][i] = dat;
                //   //console.log(dat);
                //});
            });
            
            map.width = data.width;
            map.height = data.height;
            map.tile_size.x = data.tilewidth;
            map.tile_size.y = data.tileheight;
        },
        data: {},
        async: false
    });
    
    console.log(map);
    return map;
}