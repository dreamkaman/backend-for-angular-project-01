const express = require('express');

const router = express.Router();

const createError = require('http-errors');

const { Comment, schemas } = require('../../models/comment');

router.get('/', async (req, res, next) => {
  try {
    const { detailId } = req.user;

    const result = await Comment.find({ detailId }, '-createdAt -updatedAt');

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { detailId } = req.user;

    const { error } = await schemas.commentAddSchema.validateAsync(req.body);

    if (error) {
      throw createError(400, 'missing required name field');
    }

    const data = { ...req.body, detailId };

    const result = await Comment.create(data);

    res.status(201).json(result);
  } catch (error) {
    if ((error.message.includes = 'validation failed')) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const { detailId } = req.user;
    // const { _id: id } = req.user;

    const result = await Comment.findOneAndDelete({ detailId, commentId });

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

    const { detailId } = req.user;

    const body = req.body;

    const { error } = await schemas.commentUpdateSchema.validateAsync(body);

    if (error) {
      throw createError(400, 'Validation error');
    }

    const result = await Comment.findOneAndUpdate({ detailId, commentId }, body, { new: true });
    if (!result) {
      throw createError(404, 'Not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
