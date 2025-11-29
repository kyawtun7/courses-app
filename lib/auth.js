// lib/auth.js
import jwt from 'jsonwebtoken';

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Helper to read token from cookie header (server-side)
export function getTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((c) => c.trim());
  for (const part of parts) {
    if (part.startsWith('token=')) {
      return part.replace('token=', '');
    }
  }
  return null;
}
