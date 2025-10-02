const crypto = require("crypto");

module.exports = (string, action = "encrypt") => {
  // AES is a symmetric key block cipher, 256 refers to the key size in bits,
  // and CBC is the block cipher mode of operation. It is a widely used and secure encryption algorithm.
  const algorithm = "aes-256-cbc";

  // Convert hex strings to buffers for crypto
  // Key should be 32 bytes (64 hex characters) for AES-256
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  // IV should be 16 bytes (32 hex characters) for AES-256-CBC
  const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

  if (action === "encrypt") {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(string, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } else if (action === "decrypt") {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(string, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};
