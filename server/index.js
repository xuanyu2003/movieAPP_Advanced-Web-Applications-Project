import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import reviewRouter from "./routes/reviewRouter.js";
import groupRouter from "./routes/groupRouter.js";
import movieRouter from './routes/movieRouter.js';
import userpage from "./routes/userpageRouter.js"
import notificationRouter from'./routes/notificationRouter.js'

const port = process.env.APP_PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/movie', movieRouter);
app.use("/reviews", reviewRouter);
app.use("/groups", groupRouter)
app.use("/userpage", userpage)
app.use('/notification',notificationRouter)

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});