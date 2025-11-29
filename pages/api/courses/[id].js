// pages/api/courses/[id].js
import { getPool } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const token = req.cookies?.token || null;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const pool = getPool();

  if (method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, title, image_url AS imageUrl, description, level, price FROM courses WHERE id = ?',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error('GET course error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (method === 'PUT') {
    const { title, description, level, imageUrl, price } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const priceNumber = isNaN(parseFloat(price)) ? 0 : parseFloat(price);

    try {
      await pool.query(
        'UPDATE courses SET title = ?, image_url = ?, description = ?, level = ?, price = ? WHERE id = ?',
        [title, imageUrl || '', description || '', level || '', priceNumber, id]
      );
      return res.status(200).json({ message: 'Course updated' });
    } catch (err) {
      console.error('PUT course error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (method === 'DELETE') {
    try {
      await pool.query('DELETE FROM courses WHERE id = ?', [id]);
      return res.status(200).json({ message: 'Course deleted' });
    } catch (err) {
      console.error('DELETE course error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
