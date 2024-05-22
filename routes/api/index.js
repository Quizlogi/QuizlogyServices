const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js');
const routes = files.map(file => require(`./${file}`));

module.exports = [...routes.flat()];