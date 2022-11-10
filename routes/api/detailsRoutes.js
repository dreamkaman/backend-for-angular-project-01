const express = require('express');

const router = express.Router();

const createError = require('http-errors');

const { Detail, schemas } = require('../../models/detailModel');

router.get('/', async (req, res, next) => {
  try {
    const { boardId } = req.user;

    const result = await Detail.find({ boardId }, '-createdAt -updatedAt');

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { boardId } = req.user;

    const { error } = schemas.detailAddSchema.validate(req.body);

    if (error) {
      throw createError(400, 'missing required name field');
    }

    const data = { ...req.body, boardId };

    const result = await Detail.create(data);

    res.status(201).json(result);
  } catch (error) {
    if ((error.message.includes = 'validation failed')) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete('/:detailId', async (req, res, next) => {
  try {
    const { boardId } = req.user;

    const { detailId } = req.params;

    const result = await Detail.findOneAndDelete({ _id: detailId, boardId });

    if (!result) {
      throw createError(404, 'Not found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/:detailId', async (req, res, next) => {
  try {
    const { detailId } = req.params;

    const { boardId } = req.user;

    const body = req.body;

    const { error } = await schemas.detailUpdateSchema.validateAsync(body); //just try and

    if (error) {
      throw createError(400, 'Validation error');
    }

    //return old (not updated) detail!!!
    const result = await Detail.findOneAndUpdate({ _id: detailId, boardId }, body);
    if (!result) {
      throw createError(404, 'Not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
