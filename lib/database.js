const mariadb = require('mariadb');
const config = require('./config.js');

const pool = mariadb.createPool({
    host: config['DATABASE_URL'], 
    user: config['DATABASE_USERNAME'], 
    password: config['DATABASE_PASSWORD'],
    database: config['DATABASE'],
    connectionLimit: 5
});

async function runQuery(query){
    let conn;
    let output = {};
    console.log("Query run: " + query);
    try {
        conn = await pool.getConnection();
        output = await conn.query(query);
    } catch (err) {
        throw err;
    } finally {
        conn.end();
        return output;
    }
}

module.exports = {
    createTable: (table) => {runQuery('CREATE TABLE IF NOT EXISTS ' + table)},
    insert: (table_name, columns, values) => {runQuery('INSERT INTO ' + table_name + ' (' + columns + ') VALUES (' + values + ')')},
    select: (table_name, columns, condition) => {
    let query = 'SELECT ' + columns + ' FROM ' + table_name;
    if(condition != undefined) query += ' WHERE ' + condition;
    return runQuery(query);}
};