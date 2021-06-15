import UserData from '../models/user';
import Validation from '../models/validation';

const ValidateFrom = (
  userData: UserData,
  passwordConfirm: string
): Validation => {
  if (userData.password !== passwordConfirm) {
    return {
      validated: false,
      field: 'passwordconfirm',
      error: "passwords don't match",
    };
  }
  if (userData.email === '') {
    return {
      validated: false,
      field: 'email',
      error: 'Field is empty',
    };
  }
  if (userData.password === '') {
    return {
      validated: false,
      field: 'password',
      error: 'Field is empty',
    };
  }
  if (userData.username === '') {
    return {
      validated: false,
      field: 'username',
      error: 'Field is empty',
    };
  }

  return {
    validated: true,
    field: '',
    error: '',
  };
};

export default ValidateFrom;
