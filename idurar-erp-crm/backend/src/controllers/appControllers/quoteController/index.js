const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Quote');

const convert = require('./convert');
const create = require('./create');
const update = require('./update');

methods.create = create;
methods.update = update;
methods.convert = convert;

module.exports = methods;
