# aes-ccm

AES CCM module using OpenSSL

## Installation

`npm install aes-ccm`

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

Copied from [node-aes-ccm](https://github.com/particle-iot/node-aes-ccm).
