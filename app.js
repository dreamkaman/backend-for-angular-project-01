const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const authRouter = require('./routes/api/authRoutes');
const usersRouter = require('./routes/api/usersRoutes');
const boardsRouter = require('./routes/api/boardsRoutes');
const detailsRouter = require('./routes/api/detailsRoutes');
const commentsRouter = require('./routes/api/commentsRoutes');

const { authenticate, addBoardId, addDetailId } = require('./middleWares');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/boards', authenticate, boardsRouter);

app.use('/api/boards/:boardId/details', authenticate, addBoardId, detailsRouter);

app.use(
  '/api/boards/:boardId/details/:detailId/comments',
  authenticate,
  addBoardId,
  addDetailId,
  commentsRouter,
);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
