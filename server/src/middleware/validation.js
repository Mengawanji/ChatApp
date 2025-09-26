
export const validateUser = (req, res, next) => {
  const { username, email, password } = req.body || {};
  
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  next();
};
