const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('@/controllers/customerControllers/customerAuth');
const { myInvoices, myQuotes, myPayments, mySummary } = require('@/controllers/customerControllers/customerData');
const isCustomerAuth = require('@/controllers/customerControllers/isCustomerAuth');

// Public routes
router.post('/customer/register', register);
router.post('/customer/login', login);

// Protected routes
router.get('/customer/profile', isCustomerAuth, getProfile);
router.get('/customer/my-invoices', isCustomerAuth, myInvoices);
router.get('/customer/my-quotes', isCustomerAuth, myQuotes);
router.get('/customer/my-payments', isCustomerAuth, myPayments);
router.get('/customer/my-summary', isCustomerAuth, mySummary);

module.exports = router;
