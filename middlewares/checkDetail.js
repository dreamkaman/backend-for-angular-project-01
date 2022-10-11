const checkDetail = async (req, res, next) => {
  try {
    const { detailId } = req.params;

    req.user = { ...req.user, detailId };

    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = 'Bad request parameters';
    }

    next(error);
  }
};

module.exports = checkDetail;
