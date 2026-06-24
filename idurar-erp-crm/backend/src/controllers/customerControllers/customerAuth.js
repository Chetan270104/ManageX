const jwt = require('jsonwebtoken');
const CustomerUser = require('@/models/appModels/CustomerUser');
const Client = require('@/models/appModels/Client');

const customerFields = '_id name email clientId enabled created';
const clientFields = 'name email phone country address';

const signToken = (id) =>
  jwt.sign({ id, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

const sanitizeCustomer = (customer) => ({
  _id: customer._id,
  name: customer.name,
  email: customer.email,
  clientId: customer.clientId,
  enabled: customer.enabled,
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await CustomerUser.findOne({ email: normalizedEmail, removed: false });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A customer account already exists for this email',
      });
    }

    const matchedClient = await Client.findOne({ email: normalizedEmail, removed: false }).select('_id');

    const newUser = await CustomerUser.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      clientId: matchedClient ? matchedClient._id : null,
    });

    const token = signToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'Customer account created successfully',
      result: {
        token,
        customer: sanitizeCustomer(newUser),
      },
    });
  } catch (error) {
    console.error('Customer register error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const customer = await CustomerUser.findOne({
      email: email.toLowerCase().trim(),
      removed: false,
      enabled: true,
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signToken(customer._id);

    return res.status(200).json({
      success: true,
      result: {
        token,
        customer: sanitizeCustomer(customer),
      },
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const customer = await CustomerUser.findById(req.customerId)
      .select(customerFields)
      .populate('clientId', clientFields)
      .lean();

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    return res.status(200).json({
      success: true,
      result: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        enabled: customer.enabled,
        created: customer.created,
        client: customer.clientId || null,
      },
    });
  } catch (error) {
    console.error('Customer profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, getProfile };
