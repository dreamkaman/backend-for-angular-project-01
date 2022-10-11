//Имя файла модели - всегда название в единственном числе
const { Schema, model } = require('mongoose');

const Joi = require('Joi');

const commentSchema = Schema(
  {
    detailId: {
      type: Schema.Types.ObjectId,
      ref: 'detail',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

const Comment = model('comment', commentSchema); //название - существительное в единственном числе с большой буквы

const commentAddSchema = Joi.object({
  text: Joi.string().required(),
});

const commentUpdateSchema = Joi.object({
  text: Joi.string(),
});

module.exports = {
  Comment,
  schemas: {
    commentAddSchema,
    commentUpdateSchema,
  },
};
