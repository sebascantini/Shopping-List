const database = require("./botdb.js");

let valid_users = {};

function command(regex, action){
    return {regex: regex, action: action};
}

const starting_menu = {
    ping: command(/(P|p)ing/, (msg) => {msg.reply.text('Ping')}), // ping
    getList: command(/(G|g)et list$/, (msg) => {msg.reply.text('list')}), // get list
    getListFor: command(/(G|g)et list \w+$/, (msg) => {msg.reply.text('list for temp')}), // get list [loc_name]
    buyProduct: command(/^\+ ?\d+ \w+$/, (msg) => {msg.reply.text('add')}), // +[amount] [prod_name]
    consumeProduct: command(/^\- ?\d+ \w+$/, (msg) => {msg.reply.text('sub')}), // -[amount] [prod_name]
    editProducts: command(/(E|e)dit products$/, (msg, user_menu) => {user_menu[msg.chat.id].push(edit_products_menu)}), // edit products
    editLocations: command(/(E|e)dit locations$/, (msg, user_menu) => {user_menu[msg.chat.id].push(edit_locations_menu)}), // edit locations
    grantAccess: command(/(G|g)rant access \w+/, (msg) => {valid_users.push(msg.text.split(' ')[2]); msg.reply.text('Please ask the new user to use the command \'Validate\' on me.')}) // grant access [telegram_username]
}

const edit_products_menu = {
    addProduct: command(/(A|a)dd \w+ \d+ \d+$/, (msg) => {msg.reply.text('Product added')}), // add [new_name]
    removeProduct: command(/(R|r)emove \w+$/, (msg) => {msg.reply.text('Product removed')}), // remove [prod_name]
    renameProduct: command(/(R|r)ename \w+ \w+$/, (msg) => {msg.reply.text('Product renamed')}), // rename [prod_name] [new_name]
    editQuantity: command(/\w+ \d+$/, (msg) => {msg.reply.text('Product capacity changed')}), // [prod] [new_desired_quantity]
    back: command(/(B|b)ack$/, (msg, user_menu) => {user_menu[msg.chat.id].pop()}), // return
}

const edit_locations_menu = {
    addLocation: command(/(A|a)dd \w+$/, (msg) => {msg.reply.text('Location added')}), // add [new_name]
    removeLocation: command(/(R|r)emove \w+$/, (msg) => {msg.reply.text('Location removed')}), // remove [loc_name]
    renameLocation: command(/(R|r)ename \w+ \w+$/, (msg) => {msg.reply.text('Location renamed')}), // rename [loc_name] [new_name]
    editLocation: command(/(E|e)dit \w+$/, (msg, user_menu) => {user_menu[msg.chat.id].push(edit_location_pricing_menu); msg.reply.text('Please type the name of a product, followed by it\'s price.')}), // edit location [loc_name]
    back: command(/(B|b)ack$/, (msg, user_menu) => {user_menu[msg.chat.id].pop()}), // return
}

const edit_location_pricing_menu = {
    editPrice: command(/\w+ (\d+)(.\d\d)?$/, (msg, user_menu) => {user_menu[msg.chat.id].push(msg.reply.text('Product changed'))}), // [prod] [new_price]
    back: command(/(B|b)ack$/, (msg, user_menu) => {user_menu[msg.chat.id].pop()}), // return
}

async function validate(msg){
    if(database.noWhiteListedUsers || msg.chat.username in valid_users){
        database.whitelistUser(msg.chat.id, msg.chat.username);
        console.log("User Validated: " + msg.chat.username);
        msg.reply.text('Access Granted');
    } else
        msg.reply.text('Access Denied');
}

const unvalidated_menu = {validate: command(/(V|v)alidate/, (msg) => {validate(msg)})}

module.exports = {valid: starting_menu, invalid: unvalidated_menu}
