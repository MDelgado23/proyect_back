import { createConnection } from 'mysql2/promise';

async function createDatabase() {
  const connection = await createConnection({
    host: '127.0.0.1',
    user: 'admin',
    password: '1234',
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ruletabd`);
  

  await connection.end();
}

createDatabase()
  .then(() => {
    console.log('Database created or already exists');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating database:', err);
    process.exit(1);
  });
