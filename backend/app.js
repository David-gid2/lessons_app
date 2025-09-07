import https from 'https';
import express from 'express';
//import { createProxyMiddleware } from 'http-proxy-middleware';
import userRouter from './routes/userRouter.js';
import lesRouter from './routes/lesRouter.js';
import cors from 'cors';

const app = express();
const port = 4000;
app.use(cors());
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
app.use('/api/lesson', lesRouter);


function pingGoogle() {
  https.get("https://www.google.com", (res) => {
    console.log(`[${new Date().toISOString()}] Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  });
}


pingGoogle();

setInterval(pingGoogle, 40000);


// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено: http://localhost:${port}`);
});
