import pool from '../config/database.js';

const Message = {
  // Table creation function
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        text TEXT CHECK (LENGTH(text) <= 2000),
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT fk_sender
          FOREIGN KEY (sender_id) 
          REFERENCES users(id)
          ON DELETE CASCADE,
          
        CONSTRAINT fk_receiver
          FOREIGN KEY (receiver_id) 
          REFERENCES users(id)
          ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);

      DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
      CREATE TRIGGER update_messages_updated_at 
          BEFORE UPDATE ON messages 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `;
    
    try {
      await pool.query(query);
      console.log('Messages table created successfully');
    } catch (error) {
      console.error('Error creating messages table:', error);
    }
  },

  // Model methods
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByUsers: async (senderId, receiverId) => {
    const result = await pool.query(
      'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at',
      [senderId, receiverId]
    );
    return result.rows;
  },

  create: async (messageData) => {
    const { senderId, receiverId, text, image } = messageData;
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, text, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [senderId, receiverId, text, image]
    );
    return result.rows[0];
  },

  // Get messages with user details (join example)
  findWithUsers: async (senderId, receiverId) => {
    const result = await pool.query(
      `SELECT m.*, 
              s.email as sender_email, s.full_name as sender_name,
              r.email as receiver_email, r.full_name as receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at`,
      [senderId, receiverId]
    );
    return result.rows;
  }
};

export default Message;