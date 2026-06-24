const Invoice = require('@/models/appModels/Invoice');
const Quote = require('@/models/appModels/Quote');
const Payment = require('@/models/appModels/Payment');
const CustomerUser = require('@/models/appModels/CustomerUser');

const getClientId = async (customerId) => {
  const customer = await CustomerUser.findById(customerId).select('clientId').lean();
  return customer?.clientId || null;
};

const emptyList = (message = 'No linked customer record yet') => ({
  success: true,
  result: [],
  message,
});

const myInvoices = async (req, res) => {
  try {
    const clientId = await getClientId(req.customerId);

    if (!clientId) {
      return res.status(200).json(emptyList());
    }

    const invoices = await Invoice.find({
      client: clientId,
      removed: false,
    })
      .select('number date expiredDate status paymentStatus total currency items notes created updated')
      .sort({ created: -1 })
      .lean();

    return res.status(200).json({ success: true, result: invoices });
  } catch (error) {
    console.error('myInvoices error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const myQuotes = async (req, res) => {
  try {
    const clientId = await getClientId(req.customerId);

    if (!clientId) {
      return res.status(200).json(emptyList());
    }

    const quotes = await Quote.find({
      client: clientId,
      removed: false,
    })
      .select('number date expiredDate status total currency items notes created updated')
      .sort({ created: -1 })
      .lean();

    return res.status(200).json({ success: true, result: quotes });
  } catch (error) {
    console.error('myQuotes error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const myPayments = async (req, res) => {
  try {
    const clientId = await getClientId(req.customerId);

    if (!clientId) {
      return res.status(200).json(emptyList());
    }

    const payments = await Payment.find({
      client: clientId,
      removed: false,
    })
      .select('number date amount currency invoice ref description created updated')
      .populate('invoice', 'number')
      .sort({ created: -1 })
      .lean();

    const result = payments.map((payment) => ({
      ...payment,
      invoiceNumber: payment.invoice?.number || null,
      invoice: payment.invoice?._id || payment.invoice || null,
    }));

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('myPayments error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const mySummary = async (req, res) => {
  try {
    const clientId = await getClientId(req.customerId);

    if (!clientId) {
      return res.status(200).json({
        success: true,
        result: {
          invoices: 0,
          quotes: 0,
          payments: 0,
          unpaid: 0,
          outstandingAmount: 0,
          paidAmount: 0,
          currency: 'INR',
        },
      });
    }

    const [invoiceCount, quoteCount, paymentCount, unpaidCount, invoices, payments] = await Promise.all([
      Invoice.countDocuments({ client: clientId, removed: false }),
      Quote.countDocuments({ client: clientId, removed: false }),
      Payment.countDocuments({ client: clientId, removed: false }),
      Invoice.countDocuments({ client: clientId, removed: false, paymentStatus: { $in: ['unpaid', 'partially'] } }),
      Invoice.find({ client: clientId, removed: false }).select('total currency paymentStatus').lean(),
      Payment.find({ client: clientId, removed: false }).select('amount currency').lean(),
    ]);

    const outstandingAmount = invoices
      .filter((invoice) => invoice.paymentStatus !== 'paid')
      .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);

    const paidAmount = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
    const currency = invoices[0]?.currency || payments[0]?.currency || 'INR';

    return res.status(200).json({
      success: true,
      result: {
        invoices: invoiceCount,
        quotes: quoteCount,
        payments: paymentCount,
        unpaid: unpaidCount,
        outstandingAmount,
        paidAmount,
        currency,
      },
    });
  } catch (error) {
    console.error('mySummary error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { myInvoices, myQuotes, myPayments, mySummary };
