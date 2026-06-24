const mongoose = require('mongoose');

const Model = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');

const convert = async (req, res) => {
  try {
    const quoteId = req.params.id;
    
    // Find the quote
    const quote = await Model.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Quote not found',
      });
    }

    // Check if already converted
    const existingInvoice = await InvoiceModel.findOne({ 'converted.quote': quoteId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Quote is already converted to an invoice',
      });
    }

    // Get the next invoice number from settings
    const SettingModel = mongoose.model('Setting');
    let invoiceNumberSetting = await SettingModel.findOne({ settingKey: 'last_invoice_number' });
    let invoiceNumber = invoiceNumberSetting ? parseInt(invoiceNumberSetting.settingValue) + 1 : 1;

    // Create a new Invoice based on the Quote
    const invoiceData = {
      createdBy: req.admin._id,
      number: invoiceNumber,
      year: new Date().getFullYear(),
      client: quote.client,
      items: quote.items.map(item => ({
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      taxRate: quote.taxRate,
      subTotal: quote.subTotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
      currency: quote.currency,
      discount: quote.discount,
      notes: quote.notes,
      status: 'draft',
      date: new Date(),
      expiredDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      converted: {
        from: 'quote',
        quote: quoteId
      }
    };

    const newInvoice = await new InvoiceModel(invoiceData).save();

    // Update quote status to 'accepted' or similar if needed, and save
    quote.status = 'sent'; // Typically converted means it was sent/accepted
    await quote.save();

    // Increment the invoice number setting
    if (invoiceNumberSetting) {
      await SettingModel.findOneAndUpdate(
        { settingKey: 'last_invoice_number' },
        { $inc: { settingValue: 1 } },
        { new: true }
      ).exec();
    }

    return res.status(200).json({
      success: true,
      result: newInvoice,
      message: 'Successfully converted Quote to Invoice',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error during conversion',
      error: error.message
    });
  }
};

module.exports = convert;
