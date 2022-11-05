const express = require('express');

const router = express.Router();

const createError = require('http-errors');

const { Board, schemas } = require('../../models/boardModel');

router.get('/', async (req, res, next) => {
  try {
    const { _id } = req.user;

    const result = await Board.find({ owner: _id }, '-createdAt -updatedAt');

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:boardId', async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const { _id: id } = req.user;

    const result = await Board.findById(boardId);

    if (!result || String(result.owner._id) !== String(id)) {
      throw createError(404, 'Not found');
    }

    res.json(result);
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.status = 404;
    }
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = await schemas.boardAddSchema.validateAsync(req.body);

    if (error) {
      throw createError(400, 'missing required name field');
    }

    const creationDate = new Date().toISOString();

    const data = { ...req.body, owner: req.user._id, creationDate };

    const result = await Board.create(data);

    res.status(201).json(result);
  } catch (error) {
    if ((error.message.includes = 'validation failed')) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete('/:boardId', async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const { _id: id } = req.user;

    const result = await Board.findOneAndDelete({ _id: boardId, owner: { _id: id } });

    if (!result) {
      throw createError(404, 'Not found');
    }

    res.json({
      boardId,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:boardId', async (req, res, next) => {
  try {
    const { boardId } = req.params;

    // const body = req.body;

    const { name, description } = req.body;

    body = description ? { name, description } : { name };

    const { error } = await schemas.boardUpdateSchema.validateAsync(body);

    if (error) {
      throw createError(400, 'Validation error');
    }

    const result = await Board.findByIdAndUpdate(boardId, body, { new: true });
    if (!result) {
      throw createError(404, 'Not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
