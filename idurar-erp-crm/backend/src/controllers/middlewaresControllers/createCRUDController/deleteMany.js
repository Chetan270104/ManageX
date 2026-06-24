const deleteMany = async (Model, req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No IDs provided for bulk delete',
      });
    }

    // Update removed field to true for all provided IDs
    const result = await Model.updateMany(
      { _id: { $in: ids } },
      { $set: { removed: true } }
    ).exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted the selected documents',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = deleteMany;
