import express from 'express';
//import { createProxyMiddleware } from 'http-proxy-middleware';
import userRouter from './routes/userRouter.js';
import lesRouter from './routes/lesRouter.js';

const app = express();
const port = 4200;

// Для роботи з JSON
app.use(express.json());


//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'index.html'));
//});

//app.use(
//    '/',
//    createProxyMiddleware({
//        target: 'http://localhost:3000', // Куди проксувати
//        //changeOrigin: true,
//    })
//);

app.use('/users', userRouter);
app.use('/lesson', lesRouter);



// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено: http://localhost:${port}`);
});
