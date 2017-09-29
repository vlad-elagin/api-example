const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'johnsmith@test.com'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'johndoe@test.com'
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'janesmith@test.com'
  },
  {
    id: 4,
    name: 'Jane Doe',
    email: 'janedoe@test.com'
  },
  {
    id: 5,
    name: 'Drunk HR',
    email: 'myvamperezvonim@test.com'
  }
]

const getStubUsers = (req, res) => {
  console.log('GETTING USERS'); // eslint-disable-line no-console
  res.send(users);
}

export default getStubUsers;
