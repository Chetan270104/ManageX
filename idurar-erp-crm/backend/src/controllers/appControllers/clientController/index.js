const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Client');
  const methods = createCRUDController('Client');

  methods.create = async (req, res) => {
    try {
      const { phone, email } = req.body;
      const queryConditions = [];
      if (phone && phone.trim() !== '') {
        queryConditions.push({ phone: phone.trim() });
      }
      if (email && email.trim() !== '') {
        queryConditions.push({ email: email.trim() });
      }

      if (queryConditions.length > 0) {
        const existingClient = await Model.findOne({
          $or: queryConditions,
          removed: false,
        });

        if (existingClient) {
          let message = 'A customer with this ';
          if (existingClient.phone === phone?.trim() && existingClient.email === email?.trim()) {
            message += 'phone number and email already exists.';
          } else if (existingClient.phone === phone?.trim()) {
            message += 'phone number already exists.';
          } else {
            message += 'email address already exists.';
          }
          return res.status(400).json({
            success: false,
            result: null,
            message,
          });
        }
      }

      const createMethod = require('@/controllers/middlewaresControllers/createCRUDController/create');
      return createMethod(Model, req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
  };

  methods.update = async (req, res) => {
    try {
      const { phone, email } = req.body;
      const queryConditions = [];
      if (phone && phone.trim() !== '') {
        queryConditions.push({ phone: phone.trim() });
      }
      if (email && email.trim() !== '') {
        queryConditions.push({ email: email.trim() });
      }

      if (queryConditions.length > 0) {
        const existingClient = await Model.findOne({
          _id: { $ne: req.params.id },
          $or: queryConditions,
          removed: false,
        });

        if (existingClient) {
          let message = 'A customer with this ';
          if (existingClient.phone === phone?.trim() && existingClient.email === email?.trim()) {
            message += 'phone number and email already exists.';
          } else if (existingClient.phone === phone?.trim()) {
            message += 'phone number already exists.';
          } else {
            message += 'email address already exists.';
          }
          return res.status(400).json({
            success: false,
            result: null,
            message,
          });
        }
      }

      const updateMethod = require('@/controllers/middlewaresControllers/createCRUDController/update');
      return updateMethod(Model, req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
  };

  methods.summary = (req, res) => summary(Model, req, res);
  return methods;
}

module.exports = modelController();
