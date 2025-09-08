import express, { Request, Response, Router } from 'express';
import db from '../db';

const router: Router = express.Router();

// Middleware to simulate authentication
const authenticateToken = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  // In a real implementation, you would verify the JWT token here
  // For now, we'll assume the token is valid and userId is 1 for testing
  (req as any).userId = 1; // Mock user ID
  next();
};

// Get user favorites
router.get('/favorites', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    db.all('SELECT coin_id FROM favorites WHERE user_id = ?', [userId], (err: any, rows: any[]) => {
      if (err) {
        console.error('Error fetching favorites:', err);
        return res.status(500).json({ message: 'Error fetching favorites' });
      }
      
      const favorites = rows.map(row => row.coin_id);
      return res.json(favorites);
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Add coin to favorites
router.post('/favorites/:coinId', authenticateToken, (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    const userId = (req as any).userId;
    
    // Check if already in favorites
    db.get('SELECT id FROM favorites WHERE user_id = ? AND coin_id = ?', [userId, coinId], (err: any, row: any) => {
      if (err) {
        console.error('Error checking favorite:', err);
        return res.status(500).json({ message: 'Error adding favorite' });
      }
      
      if (row) {
        return res.json({ message: 'Coin already in favorites' });
      }
      
      // Add to favorites
      db.run('INSERT INTO favorites (user_id, coin_id) VALUES (?, ?)', [userId, coinId], (err: any) => {
        if (err) {
          console.error('Error adding favorite:', err);
          return res.status(500).json({ message: 'Error adding favorite' });
        }
        
        return res.json({ message: 'Coin added to favorites' });
      });
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return res.status(500).json({ message: 'Error adding favorite' });
  }
});

// Remove coin from favorites
router.delete('/favorites/:coinId', authenticateToken, (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    const userId = (req as any).userId;
    
    db.run('DELETE FROM favorites WHERE user_id = ? AND coin_id = ?', [userId, coinId], function(err: any) {
      if (err) {
        console.error('Error removing favorite:', err);
        return res.status(500).json({ message: 'Error removing favorite' });
      }
      
      // Check if any row was affected
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Coin not found in favorites' });
      }
      
      return res.json({ message: 'Coin removed from favorites' });
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({ message: 'Error removing favorite' });
  }
});

// Get user portfolio
router.get('/portfolio', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    db.all('SELECT coin_id, amount, purchase_price FROM portfolio WHERE user_id = ?', [userId], (err: any, rows: any[]) => {
      if (err) {
        console.error('Error fetching portfolio:', err);
        return res.status(500).json({ message: 'Error fetching portfolio' });
      }
      
      const portfolio = rows.map(row => ({
        coinId: row.coin_id,
        amount: row.amount,
        purchasePrice: row.purchase_price
      }));
      
      return res.json(portfolio);
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

// Add coin to portfolio
router.post('/portfolio', authenticateToken, (req: Request, res: Response) => {
  try {
    const { coinId, amount, purchasePrice } = req.body;
    const userId = (req as any).userId;
    
    // Validate input
    if (!coinId || amount === undefined || purchasePrice === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Add to portfolio
    db.run(
      'INSERT INTO portfolio (user_id, coin_id, amount, purchase_price) VALUES (?, ?, ?, ?)',
      [userId, coinId, amount, purchasePrice],
      function(err: any) {
        if (err) {
          console.error('Error adding to portfolio:', err);
          return res.status(500).json({ message: 'Error adding to portfolio' });
        }
        
        return res.json({ message: 'Coin added to portfolio' });
      }
    );
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    return res.status(500).json({ message: 'Error adding to portfolio' });
  }
});

// Update coin in portfolio
router.put('/portfolio/:coinId', authenticateToken, (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    const { amount, purchasePrice } = req.body;
    const userId = (req as any).userId;
    
    // Validate input
    if (amount === undefined || purchasePrice === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Update portfolio item
    db.run(
      'UPDATE portfolio SET amount = ?, purchase_price = ? WHERE user_id = ? AND coin_id = ?',
      [amount, purchasePrice, userId, coinId],
      function(err: any) {
        if (err) {
          console.error('Error updating portfolio:', err);
          return res.status(500).json({ message: 'Error updating portfolio' });
        }
        
        // Check if any row was affected
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Coin not found in portfolio' });
        }
        
        return res.json({ message: 'Portfolio updated' });
      }
    );
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return res.status(500).json({ message: 'Error updating portfolio' });
  }
});

// Remove coin from portfolio
router.delete('/portfolio/:coinId', authenticateToken, (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    const userId = (req as any).userId;
    
    db.run('DELETE FROM portfolio WHERE user_id = ? AND coin_id = ?', [userId, coinId], function(err: any) {
      if (err) {
        console.error('Error removing from portfolio:', err);
        return res.status(500).json({ message: 'Error removing from portfolio' });
      }
      
      // Check if any row was affected
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Coin not found in portfolio' });
      }
      
      return res.json({ message: 'Coin removed from portfolio' });
    });
  } catch (error) {
    console.error('Error removing from portfolio:', error);
    return res.status(500).json({ message: 'Error removing from portfolio' });
  }
});

export default router;