export const checkAdminToken = (req, res, next) => {
  const token = req.query.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Токен відсутній' });
  }

  
  const ADMIN_TOKEN = 'SECRET123';

  
  const providedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

  if (providedToken !== ADMIN_TOKEN) {
    return res.status(403).json({ message: 'you don\'t nave access' });
  }

  next(); 
};
