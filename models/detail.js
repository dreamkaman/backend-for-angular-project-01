//Имя файла модели - всегда название в единственном числе
const { Schema, model } = require('mongoose');

const Joi = require('Joi');

const detailSchema = Schema(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'board',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Task name is required'],
    },
    status: {
      type: String,
      required: [true, 'Status of task is required'],
      enum: ['todo', 'in progress', 'done', 'archived'],
    },
  },
  { versionKey: false, timestamps: true },
);

const Detail = model('detail', detailSchema); //название - существительное в единственном числе с большой буквы

const detailAddSchema = Joi.object({
  boardId: Joi.string().required(),
  name: Joi.string().required(),
  status: Joi.string().valid('todo', 'in progress', 'done', 'archived').required(),
});

const detailUpdateSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid('todo', 'in progress', 'done', 'archived'),
});

module.exports = {
  Detail,
  schemas: {
    detailAddSchema,
    detailUpdateSchema,
  },
};
