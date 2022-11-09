const menus = require('./menus.js');
const database = require('./botdb.js')
const config = require('./config.js');
const telebot = require('telebot');
const crypto = require('crypto');

const bot = new telebot({token: config["TELEGRAM_TOKEN"]});

let user_menu = {};

async function validateIdentiy(chat_id){ //validate
    return await database.isWhiteListed(chat_id);
}

async function handleInput(msg){
    let command_menu = {};
    if(await validateIdentiy(msg.chat.id)){
        if(!(msg.chat.id.toString() in user_menu))
            user_menu[msg.chat.id] = [menus.valid];
        command_menu = user_menu[msg.chat.id][user_menu[msg.chat.id].length - 1];
    } else
        command_menu = menus.invalid;
    for (const command in command_menu){
        if(command_menu[command].regex.test(msg.text)){
            command_menu[command].action(msg, user_menu);
            break;
        }
    }
}

bot.on('text', (msg) => {handleInput(msg)});

module.exports = bot;