const database = require('./database.js')

const products_table = 'Products (Product_ID INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(35) UNIQUE NOT NULL, Capacity INT NOT NULL, Owned INT NOT NULL, CHECK(Capacity >= 0 AND Owned >= 0))'
const locations_table = 'Locations (Location_ID INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(35) UNIQUE NOT NULL)'
const prices_table = 'Prices (Product_ID INT, Location_ID INT, Price Decimal(10, 2) NOT NULL, FOREIGN KEY (Product_ID) REFERENCES Products (Product_ID), FOREIGN KEY (Location_ID) REFERENCES Locations (Location_ID), CONSTRAINT PK_Band PRIMARY KEY (Product_ID, Location_ID))'
const whitelist_table = 'Whitelist (Chat_ID BIGINT PRIMARY KEY, Username CHAR(128) UNIQUE NOT NULL)'

database.createTable(products_table);
database.createTable(locations_table);
database.createTable(prices_table);
database.createTable(whitelist_table);

module.exports = {
    whitelistUser: (chat_id, user_name) => {database.insert('Whitelist', 'Chat_ID, Username', '' + chat_id + ',\'' + user_name + '\'')},
    isWhiteListed: async (chat_id) => {return (await database.select('Whitelist', '*', 'Chat_ID = \'' + chat_id + '\'')).length == 1},
    noWhiteListedUsers: async (chat_id) => {return (await database.select('Whitelist', '*')).length == 0}
}