export default function generateCode(length: number = 6): string {
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomChar = Math.floor(Math.random() * 36).toString(36);
    code += randomChar;
  }

  return code.toUpperCase();
}
