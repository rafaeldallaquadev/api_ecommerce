import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {pool} from '../db.js'
dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export async function getNewToken(refreshToken) {
    if (!refreshToken) {
    const error = new Error("Refresh token ausente" );
    error.status = 401
    throw error
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const [rows] = await pool.execute(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.id]
    );

    const user = rows[0];

    const newAccessToken = jwt.sign(
      { id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
       },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return {accessToken: newAccessToken}

  } catch (err) {
    const error = new Error("Refresh token inválido" );
    error.status = 401
    throw error
  }
}