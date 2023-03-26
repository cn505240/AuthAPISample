const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
  // return token with TTL of 30 minutes
  return jwt.sign(
    { username, exp: Math.floor(Date.now() / 1000) + 30 * 60 },
    process.env.TOKEN_SECRET
  );
}

async function authenticateRequest(req, res, next) {
  const token = req.headers['x-authentication-token'];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = await jwt.verify(token, process.env.TOKEN_SECRET);

    // add the retrieved user to the request payload and resume endpoint execution
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

module.exports = {
  authenticateRequest,
  generateAccessToken,
};
