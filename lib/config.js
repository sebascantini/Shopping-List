const fs = require('fs');

// Get the absulote path file
const config_path = '/home/winter/.config/assistant'

function readConfig(){
    const file = fs.readFileSync(config_path, 'ascii').split('\n');
    let config = {};
    for(let i = 0; i < file.length; ++i){
        const line = file[i].split('=');
        if(line[0] != '')
            config[line[0]] = line[1];
    }
    return config;
}

module.exports = readConfig();