import app from '@root/app';

const getUsers = async (req, res) => {
  const users = await app.db.pAll(`
    SELECT DISTINCT id, username, email
    FROM users
  `);
  res.status(200).send(users);
};

export default getUsers;
