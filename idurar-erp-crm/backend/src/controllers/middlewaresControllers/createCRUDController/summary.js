const summary = async (Model, req, res) => {
  const countAllDocsPromise = Model.countDocuments({
    removed: false,
  });

  let countFilterQuery = Model.countDocuments({
    removed: false,
  });

  if (req.query.filter && req.query.equal !== undefined) {
    countFilterQuery = countFilterQuery.where(req.query.filter).equals(req.query.equal);
  }

  const countFilterPromise = countFilterQuery.exec();
  const [countFilter, countAllDocs] = await Promise.all([countFilterPromise, countAllDocsPromise]);

  if (countAllDocs > 0) {
    return res.status(200).json({
      success: true,
      result: { countFilter, countAllDocs },
      message: 'Successfully count all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = summary;
