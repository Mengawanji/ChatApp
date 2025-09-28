import pool from '../config/database.js';

const User = {
  // Table creation function
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
        profile_pic TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `;
    
    try {
      await pool.query(query);
      console.log('Users table created successfully');
    } catch (error) {
      console.error('Error creating users table:', error);
    }
  },

  // Model methods
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  create: async (userData) => {
    const { email, fullName, password, profilePic = '' } = userData;
    const result = await pool.query(
      'INSERT INTO users (email, full_name, password, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, fullName, password, profilePic]
    );
    return result.rows[0];
  },

  update: async (id, userData) => {
    const { email, fullName, profilePic } = userData;
    const result = await pool.query(
      'UPDATE users SET email = $1, full_name = $2, profile_pic = $3 WHERE id = $4 RETURNING *',
      [email, fullName, profilePic, id]
    );
    return result.rows[0];
  }
};

export default User;