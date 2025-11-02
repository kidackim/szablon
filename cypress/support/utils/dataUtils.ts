// Czysta funkcja narzędziowa, niezwiązana z Cypress, do generowania losowych danych.
export function generateRandomString(length: number = 10): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const Utils = {
  generateRandomString,
};

export default Utils;
