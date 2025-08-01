// Quick Admin Setup Script
// Run this once to make yourself an admin

const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

async function setupAdmin() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Replace with YOUR wallet address
  const ADMIN_WALLET = "YOUR_WALLET_ADDRESS_HERE";
  
  try {
    // Create or update user as admin
    const result = await pool.query(`
      INSERT INTO users (wallet_address, role, is_admin, admin_permissions, created_at)
      VALUES ($1, 'super_admin', true, $2, NOW())
      ON CONFLICT (wallet_address) 
      DO UPDATE SET 
        role = 'super_admin',
        is_admin = true,
        admin_permissions = $2,
        updated_at = NOW()
      RETURNING *
    `, [ADMIN_WALLET, JSON.stringify(['pricing', 'content', 'users', 'analytics', 'system'])]);
    
    console.log('✅ Admin setup complete:', result.rows[0]);
    console.log('🎯 You can now access admin panels with wallet:', ADMIN_WALLET);
    
  } catch (error) {
    console.error('❌ Admin setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupAdmin();