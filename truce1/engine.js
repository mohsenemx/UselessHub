const encryptBtn = document.getElementById("encryptButton");
const decryptBtn = document.getElementById("decryptButton");
encryptBtn.addEventListener("click", () => {
  let input = document.getElementById("inputencrypt").value;
  encrypt(input);
});
decryptBtn.addEventListener("click", () => {
  let input = document.getElementById("inputdecrypt").value;
  let key = document.getElementById("decryptkey").value;
  decrypt(input, key);
});
document.getElementById("inputencrypt").addEventListener("input", () => {
  let a = document.getElementById("inputencrypt").value;
  document.getElementById("inputencrypt").value = a.replace(
    /[^\x00-\x7F]/g,
    ""
  );
});
document.getElementById("inputdecrypt").addEventListener("input", () => {
  let a = document.getElementById("inputdecrypt").value;
  document.getElementById("inputdecrypt").value = a.replace(
    /[^\x00-\x7F]/g,
    ""
  );
});
document.getElementById("decryptkey").addEventListener("input", () => {
  let a = document.getElementById("decryptkey").value;
  document.getElementById("decryptkey").value = a.replace(/[^\x00-\x7F]/g, "");
});
function encrypt(text) {
  let key = generateKey();
  let keyChar = key.split("");
  let chars = text.split("");
  let encryptedText = "";
  chars.forEach((element) => {
    //encryptedText += shiftCharacter(element, keyChar[0]);
    let ch = shiftCharacter(element, 1 * keyChar[0]);
    encryptedText += ch;
  });
  chars = encryptedText.split("");

  encryptedText = "";

  chars.forEach((element) => {
    encryptedText += shiftCharacter(element, keyChar[1].charCodeAt(0));
  });
  chars = encryptedText.split("");
  encryptedText = "";

  chars.forEach((element) => {
    encryptedText += shiftCharacter(element, -1 * keyChar[2].charCodeAt(0));
  });
  chars = encryptedText.split("");
  encryptedText = "";
  chars.forEach((element) => {
    let sign = keyChar[6] == "X" ? 1 : -1;
    let offset = Number(keyChar[3] + keyChar[4] + keyChar[5]);
    let ch = shiftCharacter(element, sign * offset);
    encryptedText += ch;
  });
  document.getElementById("keyout").innerHTML =
    "Here is your decryption key: " + textToHex(key);
  document.getElementById("encryptOut").value = encryptedText;
}
function generateKey() {
  let key = "";
  key += random(1, 9);
  key += getRandomCapitalLetter();
  key += getRandomSmallLetter();
  key += random(100, 999);
  key += !random(0, 1) ? "Z" : "X";
  key += getRandomSmallLetter();
  key += getRandomCapitalLetter();
  key += random(100, 999);
  console.log('Unencrypted Key: ' + key);
  return key;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomSmallLetter() {
  return String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1) + 97));
}
function getRandomCapitalLetter() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function textToHex(text) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(16))
    .join("");
}
function shiftCharacter(char, num) {
  const minAscii = 32;
  const maxAscii = 126;
  let shiftedAscii = char.charCodeAt(0) + num;

  if (num > 0) {
    while (shiftedAscii > maxAscii) {
      shiftedAscii -= maxAscii - minAscii + 1;
    }
  } else {
    while (shiftedAscii < minAscii) {
      shiftedAscii += maxAscii - minAscii + 1;
    }
  }

  return String.fromCharCode(shiftedAscii);
}
function hexToText(hex) {
  return hex
    .match(/.{1,2}/g)
    .reduce(
      (str, hexPair) => str + String.fromCharCode(parseInt(hexPair, 16)),
      ""
    );
}
function decrypt(text, key) {
  let usableKey = hexToText(key);
  let keyChar = usableKey.split("");
  let chars = text.split("");
  let decryptedText = "";
  chars.forEach((element) => {
    let sign = keyChar[6] == "Z" ? 1 : -1;
    let offset = Number(keyChar[3] + keyChar[4] + keyChar[5]);
    let ch = shiftCharacter(element, sign * offset);
    decryptedText += ch;
  });
  chars = decryptedText.split("");
  decryptedText = "";
  chars.forEach((element) => {
    decryptedText += shiftCharacter(element, 1 * keyChar[2].charCodeAt(0));
  });
  chars = decryptedText.split("");
  decryptedText = "";
  chars.forEach((element) => {
    decryptedText += shiftCharacter(element, -1 * keyChar[1].charCodeAt(0));
  });
  chars = decryptedText.split("");
  decryptedText = "";
  chars.forEach((element) => {
    let ch = shiftCharacter(element, -1 * keyChar[0]);
    decryptedText += ch;
  });
  document.getElementById("decryptOut").value = decryptedText;
}
