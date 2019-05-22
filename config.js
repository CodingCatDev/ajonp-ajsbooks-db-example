const crud = require('./crud');
const bookConfig = require('./data/bookConfig');

crud.updateDoc('config', 'bookSample', bookConfig);
