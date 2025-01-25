// Base64デコード関数
interface DecodeBase64 {
  (encodedString: string): string;
}

const decodeBase64: DecodeBase64 = (encodedString) => {
  return Buffer.from(encodedString, 'base64').toString('utf-8');
}

// ここにBase64の文字列を入れる（改行や不要なヘッダーを削除して入力）
const base64String = ""

const decodedText = decodeBase64(base64String);
console.log(decodedText);
