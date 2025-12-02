const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting database initialization...\n');

    // Kết nối MySQL (không chỉ định database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Đọc file schema.sql
    const schemaPath = path.join(__dirname, '../data/schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📄 Reading schema.sql...');
    await connection.query(schemaSQL);
    console.log('✅ Database schema created successfully\n');

    // Đọc file seed.sql
    const seedPath = path.join(__dirname, '../data/seed.sql');
    const seedSQL = await fs.readFile(seedPath, 'utf8');
    
    console.log('📄 Reading seed.sql...');
    await connection.query(seedSQL);
    console.log('✅ Sample data inserted successfully\n');

    // Kiểm tra kết quả
    const [databases] = await connection.query('SHOW DATABASES LIKE "QuanLyNhanVien"');
    if (databases.length > 0) {
      await connection.query('USE QuanLyNhanVien');
      
      const [tables] = await connection.query('SHOW TABLES');
      console.log('\n📊 Tables created:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });

      // Thống kê dữ liệu
      console.log('\n📈 Data statistics:');
      const [phongban] = await connection.query('SELECT COUNT(*) as count FROM PHONGBAN');
      const [chucvu] = await connection.query('SELECT COUNT(*) as count FROM CHUCVU');
      const [nhanvien] = await connection.query('SELECT COUNT(*) as count FROM NHANVIEN');
      const [nguoidung] = await connection.query('SELECT COUNT(*) as count FROM NGUOIDUNG');
      
      console.log(`   - Phòng ban: ${phongban[0].count}`);
      console.log(`   - Chức vụ: ${chucvu[0].count}`);
      console.log(`   - Nhân viên: ${nhanvien[0].count}`);
      console.log(`   - Người dùng: ${nguoidung[0].count}`);
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📝 Default accounts:');
    console.log('   Username: admin   | Password: password | Role: Admin');
    console.log('   Username: nva     | Password: password | Role: Admin');
    console.log('   Username: lvc     | Password: password | Role: KeToan');
    console.log('\n✨ You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    if (error.sql) {
      console.error('SQL Error at:', error.sql.substring(0, 200));
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run
initDatabase();