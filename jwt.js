const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Keep this secure!

const token = jwt.sign({ userId: '123', role: 'admin' }, secretKey, { expiresIn: '1h' });
console.log(token);