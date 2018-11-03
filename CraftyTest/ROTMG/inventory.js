Crafty.c("Inventory", function(){
    
})

function Item(type, name, description, properties, use, equip, user)
{
    this.type = type;
    this.name = name;
    this.description = description;
    this.properties = properties;
    this.use = use;
    this.equip = equip;
    this.user = user;
    
    return this;
}