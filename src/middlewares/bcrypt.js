import bcrypt from "bcrypt";

export function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
  const result = bcrypt.compareSync(password, user.password);
  return result;
};
