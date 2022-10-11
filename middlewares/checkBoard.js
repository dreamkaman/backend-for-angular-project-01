const checkBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    req.user = { ...req.user, boardId };

    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = 'Bad request parameters';
    }

    next(error);
  }
};

module.exports = checkBoard;
