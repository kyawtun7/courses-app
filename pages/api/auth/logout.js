// pages/api/auth/logout.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear cookie by setting expired
  res.setHeader('Set-Cookie', [
    'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
  ]);

  return res.status(200).json({ message: 'Logged out' });
}
