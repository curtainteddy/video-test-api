const fs = require('fs');
const path = require('path');

const userStatusOptions = ['active', 'offline', 'away'];

function generateUser(id) {
  const name = `User${id}`;
  const email = `user${id}@example.com`;
  const avatarURL = `https://i.pravatar.cc/150?img=${id}`;
  const status = userStatusOptions[Math.floor(Math.random() * userStatusOptions.length)];
  const password = '123456'; // simple random password

  return {
    id,
    name,
    avatarURL,
    status,
    email,
    password
  };
}

function generateUsers(count = 10) {
  const users = Array.from({ length: count }, (_, i) => generateUser(i + 1));

  const outputPath = path.join(__dirname, 'user.json');
  fs.writeFileSync(outputPath, JSON.stringify(users, null, 2));
  console.log(`✅ Generated ${count} users in ${outputPath}`);
}

generateUsers(20); // generate 20 users
