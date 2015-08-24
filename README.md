# node-aes-ccm
AES CCM module for io.js using OpenSSL

## Installation

`npm install node-aes-ccm`

## Requirements

`node-aes-ccm` requires io.js >= 3.0 because we need OpenSSL 1.0.2d or later for AES CCM support.

## encrypt

`encrypt(key, iv, plaintext, aad, auth_tag_length)`

`key`, `iv`, `plaintext`, and `aad` are all `Buffer` objects. `encrypt` will return an object like the following:

```
{
  ciphertext: Buffer,
  auth_tag: Buffer
}
```

## decrypt

`decrypt(key, iv, ciphertext, aad, auth_tag)`

`key`, `iv`, `plaintext`, `aad`, and `auth_tag` are all `Buffer` objects. `decrypt` will return an object like the following:

```
{
  plaintext: Buffer,
  auth_ok: Boolean
}
```

## References

Modeled after [node-aes-gcm](https://github.com/xorbit/node-aes-gcm).