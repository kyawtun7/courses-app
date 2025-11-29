// pages/api/courses/index.js
import { getPool } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const token = req.cookies?.token || null;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, title, image_url AS imageUrl, description, level, price, created_at FROM courses ORDER BY created_at DESC'
      );
      return res.status(200).json(rows);
    } catch (err) {
      console.error('GET courses error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const { title, description, level, imageUrl, price } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const priceNumber = isNaN(parseFloat(price)) ? 0 : parseFloat(price);

    try {
      const [result] = await pool.query(
        'INSERT INTO courses (title, image_url, description, level, price, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, imageUrl || '', description || '', level || '', priceNumber, user.id]
      );

      return res.status(201).json({
        id: result.insertId,
        title,
        imageUrl: imageUrl || '',
        description: description || '',
        level: level || '',
        price: priceNumber,
      });
    } catch (err) {
      console.error('POST course error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
