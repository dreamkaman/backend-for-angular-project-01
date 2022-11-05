//Имя файла модели - всегда название в единственном числе
const { Schema, model } = require('mongoose');

const Joi = require('Joi');
// const { string } = require('Joi');

const boardSchema = Schema({
  name: {
    type: String,
    required: [true, 'Board name is required'],
  },
  description: {
    type: String,
    required: [true, 'Board description is required'],
  },
  creationDate: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const Board = model('board', boardSchema); //название - существительное в единственном числе с большой буквы

const boardAddSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

const boardUpdateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  Board,
  schemas: {
    boardAddSchema,
    boardUpdateSchema,
  },
};
