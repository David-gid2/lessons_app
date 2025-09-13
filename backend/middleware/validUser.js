import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export const validUser = async (req, res, next) => {
    const {hash} = req.body.hash;
        if(!hash){
            return res.status(400).json({message: "error"});
        };

    const params = {};
  hash.split("&").forEach(pair => {
    const [key, value] = pair.split("=");
    params[key] = decodeURIComponent(value);
  });

  const hashToCheck = params.hash;
  delete params.hash;

  // Формуємо рядок для перевірки
  const dataCheckString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join("\n");

  // Генеруємо секретний ключ
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();

  // Створюємо HMAC
  const hmac = crypto.createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Перевірка
  if (hmac !== hashToCheck) {
    res.status(403).json({ success: false, error: "Invalid hash" });
  } 
    next();
};