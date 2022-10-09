const express = require('express');

const router = express.Router();

const createError = require('http-errors');

const { Comment, schemas } = require('../../models/comment');

const { authenticate } = require('../../middlewares/index');

// Example of body: {
//   "boardId": "",
//   "name": "",
//   "status":"";
// }

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { commentId } = req.body;

    const result = await Comment.find({ commentId }, '-createdAt -updatedAt');

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.commentAddSchema.validate(req.body);

    if (error) {
      throw createError(400, 'missing required name field');
    }

    const data = { ...req.body };

    const result = await Comment.create(data);

    res.status(201).json(result);
  } catch (error) {
    if ((error.message.includes = 'validation failed')) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete('/:commentId', authenticate, async (req, res, next) => {
  try {
    const { commentId } = req.params;

    // const { _id: id } = req.user;

    const result = await Comment.findByIdAndDelete(commentId);

    if (!result) {
      throw createError(404, 'Not found');
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const body = req.body;

    const { error } = schemas.commentUpdateSchema.validate(body);

    if (error) {
      throw createError(400, 'Validation error');
    }

    const result = await Comment.findByIdAndUpdate(commentId, body, { new: true });
    if (!result) {
      throw createError(404, 'Not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
