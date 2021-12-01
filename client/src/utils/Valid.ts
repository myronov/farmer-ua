import { IUserRegister, IPost } from './TypeScript';

export const validRegister = (userRegister: IUserRegister) => {
  const { name, account, password, cf_password } = userRegister;
  const errors: string[] = [];

  if (!name) {
    errors.push('Додайте своє імя.');
  } else if (name.length > 20) {
    errors.push('Максимальна довжина імені - 20 символів');
  }

  if (!account) {
    errors.push('Додайте свою поштову скриньку.');
  } else if (!validateEmail(account)) {
    errors.push('Пошта неправильна.');
  }

  const msg = checkPassword(password, cf_password);
  if (msg) errors.push(msg);

  return {
    errMsg: errors,
    errLength: errors.length,
  };
};

export const checkPassword = (password: string, cf_password: string) => {
  if (password.length < 6) {
    return 'Мінімальна довжина паролю 6 символів.';
  } else if (password !== cf_password) {
    return 'Паролі не співпадають.';
  }
};

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Valid Post
export const validCreatePost = ({
  title,
  content,
  description,
  thumbnail,
  category,
}: IPost) => {
  const err: string[] = [];

  if (title.trim().length < 5) {
    err.push('Мінімальний заголовок 10 символів.');
  } else if (title.trim().length > 50) {
    err.push('Максимальний заголовок 50 символів.');
  }

  if (content.trim().length < 10) {
    err.push('Мінімальна кількість контенту 10 символів.');
  }

  if (description.trim().length < 10) {
    err.push('Мінімальний опис 10 символів.');
  } else if (description.trim().length > 200) {
    err.push('Максимальний опис 200 символів.');
  }

  if (!thumbnail) {
    err.push('Завантажте ескіз.');
  }

  if (!category) {
    err.push('Оберіть категорію.');
  }

  return {
    errMsg: err,
    errLength: err.length,
  };
};

// Shallow equality
export const shallowEqual = (object1: any, object2: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};
