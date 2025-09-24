const bcrypt = require('bcrypt');

const generateHash = async () => {
  const password = 'adminpassword';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
};

generateHash();