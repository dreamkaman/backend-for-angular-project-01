const { Board } = require('../models/board');

const createError = require('http-errors');

const addBoardId = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const { _id } = req.user;

    const result = await Board.findOne({ owner: _id, _id: boardId });

    if (!result) {
      throw createError(401, 'Bad boardId');
    }

    req.user = { ...req.user, boardId };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = addBoardId;
