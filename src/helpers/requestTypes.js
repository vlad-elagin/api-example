const requestTypes = {
  Username: {
    typeOf: 'String',
    validate: (username) => {
      if (username.trim().length < 6) return false;
      return true;
    },
  },
  Password: {
    typeOf: 'String',
    validate: (password) => {
      if (password.trim().length < 6) return false;
      return true;
    },
  },
  Email: {
    typeOf: 'String',
    validate: (email) => {
      // eslint-disable-next-line no-useless-escape
      const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regexp.test(email)) return false;
      return true;
    },
  },
};

export default requestTypes;
