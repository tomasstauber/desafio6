import bcrypt from "bcrypt";

export function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
  console.log("Contraseña recibida en iVP:", password)
  return bcrypt.compareSync(password, user.password);
};
