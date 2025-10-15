const express = require('express');
const path = require('path');
const createError = require('http-errors');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const userRouter = require('./routers/Users.router');

app.use('/users',userRouter);

app.use((req, res, next) => {
  next(createError(404, `Unknown resource ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .json({ error: error.message || 'Unknown Server Error!' });
});

module.exports = app;