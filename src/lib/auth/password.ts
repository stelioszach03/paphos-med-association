import { Scrypt } from "oslo/password";

const scrypt = new Scrypt();

export async function hashPassword(plain: string) {
  return await scrypt.hash(plain);
}

export async function verifyPassword(hash: string, plain: string) {
  return await scrypt.verify(hash, plain);
}
