const { Detail } = require('../models/detailModel');

const createError = require('http-errors');

const addDetailId = async (req, res, next) => {
  try {
    const { detailId } = req.params;

    const { boardId } = req.user;

    const result = await Detail.findOne({ _id: detailId, boardId });

    if (!result) {
      throw createError(401, 'Bad detailId');
    }

    req.user = { ...req.user, detailId };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = addDetailId;
