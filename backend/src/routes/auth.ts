import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db';

const router: Router = express.Router();

// Register endpoint
router.post('/register', (req: Request, res: Response): void => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], (err: Error | null, row: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
        return;
      }
      
      if (row) {
        res.status(400).json({ message: 'Kullanıcı zaten mevcut' });
        return;
      }

      // Validate input
      if (!email || !password || !name) {
        res.status(400).json({ message: 'E-posta, şifre ve ad alanı zorunludur' });
        return;
      }

      // Hash password
      bcrypt.hash(password, 10, (err: Error | null, hashedPassword: string) => {
        if (err) {
          console.error('Password hashing error:', err);
          res.status(500).json({ message: 'Sunucu hatası oluştu' });
          return;
        }

        // Create new user
        db.run(
          'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
          [email, hashedPassword, name],
          function(this: any, err: Error | null) {
            if (err) {
              console.error('Database error:', err);
              res.status(500).json({ message: 'Sunucu hatası oluştu' });
              return;
            }

            const newUser = {
              id: this.lastID,
              email,
              name
            };

            // Generate JWT token
            const token = jwt.sign(
              { userId: newUser.id, email: newUser.email },
              process.env.JWT_SECRET || 'secret_key',
              { expiresIn: '24h' }
            );

            res.status(201).json({
              message: 'Kullanıcı başarıyla kaydedildi',
              token,
              user: newUser
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
});

// Login endpoint
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'E-posta ve şifre alanı zorunludur' });
      return;
    }

    // Find user
    db.get(
      'SELECT id, email, name, password FROM users WHERE email = ?',
      [email],
      (err: Error | null, row: any) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ message: 'Sunucu hatası oluştu' });
          return;
        }
        
        if (!row) {
          res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
          return;
        }

        // Check password
        bcrypt.compare(password, row.password, (err: Error | null, isPasswordValid: boolean) => {
          if (err) {
            console.error('Password comparison error:', err);
            res.status(500).json({ message: 'Sunucu hatası oluştu' });
            return;
          }
          
          if (!isPasswordValid) {
            res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
            return;
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: row.id, email: row.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
          );

          res.status(200).json({
            message: 'Giriş başarılı',
            token,
            user: {
              id: row.id,
              email: row.email,
              name: row.name
            }
          });
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
});

export default router;