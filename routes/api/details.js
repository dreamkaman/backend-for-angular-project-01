const express = require('express');

const router = express.Router();

const createError = require('http-errors');

const { Detail, schemas } = require('../../models/detail');

const { authenticate } = require('../../middlewares/index');

// Example of body: {
//   "boardId": "",
//   "name": "",
//   "status":"";
// }

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { boardId } = req.body;

    // const { page = 1, limit = 20 } = req.query;

    // const skip = (page - 1) * limit;

    // const limitNum = Number(limit); //skip,limit must be numbers

    // const result = await Detail.find({ owner: _id }, '-createdAt -updatedAt', {
    //   skip,
    //   limit: limitNum,
    // });

    const result = await Detail.find({ boardId }, '-createdAt -updatedAt');

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.detailAddSchema.validate(req.body);

    if (error) {
      throw createError(400, 'missing required name field');
    }

    const data = { ...req.body };

    const result = await Detail.create(data);

    res.status(201).json(result);
  } catch (error) {
    if ((error.message.includes = 'validation failed')) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete('/:detailId', authenticate, async (req, res, next) => {
  try {
    const { detailId } = req.params;

    // const { _id: id } = req.user;

    const result = await Detail.findByIdAndDelete(detailId);
    // const result = await Detail.findOneAndDelete({ _id: detailId, owner: { _id: id } });

    if (!result) {
      throw createError(404, 'Not found');
    }

    res.json({ message: 'Detail deleted' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:detailId', async (req, res, next) => {
  try {
    const { detailId } = req.params;

    const body = req.body;

    const { error } = schemas.DetailUpdateSchema.validate(body);

    if (error) {
      throw createError(400, 'Validation error');
    }

    const result = await Detail.findByIdAndUpdate(detailId, body, { new: true });
    if (!result) {
      throw createError(404, 'Not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
