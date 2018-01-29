/* jshint esversion: 6 */
/* jslint node: true */
'use strict';

const test = require('ava');
const ccm = require('../');

const TEST_CASES = [
  {
    key: '404142434445464748494a4b4c4d4e4f',
    iv: '101112131415161718191a1b',
    plain: '202122232425262728292a2b2c2d2e2f3031323334353637',
    aad: '000102030405060708090a0b0c0d0e0f10111213',
    ct: 'e3b201a9f5b71a7a9b1ceaeccd97e70b6176aad9a4428aa5',
    tag: '484392fbc1b09951',
    tampered: false
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000003020100A0A1A2A3A4A5',
    plain: '08090A0B0C0D0E0F101112131415161718191A1B1C1D1E',
    aad: '0001020304050607',
    ct: '588C979A61C663D2F066D0C2C0F989806D5F6B61DAC384',
    tag: '17E8D12CFDF926E0',
    tampered: false
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000004030201A0A1A2A3A4A5',
    plain: '08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    aad: '0001020304050607',
    ct: '72C91A36E135F8CF291CA894085C87E3CC15C439C9E43A3B',
    tag: 'A091D56E10400916',
    tampered: false
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000005040302A0A1A2A3A4A5',
    plain: '08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20',
    aad: '0001020304050607',
    ct: '51B1E5F44A197D1DA46B0F8E2D282AE871E838BB64DA859657',
    tag: '4ADAA76FBD9FB0C5',
    tampered: false
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000006050403A0A1A2A3A4A5',
    plain: '0C0D0E0F101112131415161718191A1B1C1D1E',
    aad: '000102030405060708090A0B',
    ct: 'A28C6865939A9A79FAAA5C4C2A9D4A91CDAC8C',
    tag: '96C861B9C9E61EF1',
    tampered: false
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000007060504A0A1A2A3A4A5',
    plain: '0C0D0E0F101112131415161718191A1B1C1D1E1F',
    aad: '000102030405060708090A0B',
    ct: 'DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3E',
    tag: '51E83F077D9C2D93',
    tampered: false
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000007060504A0A1A2A3A4A5',
    plain: '0C0D0E0F101112131415161718191A1B1C1D1E1F',
    aad: '000102030405060708090A0B',
    ct: 'DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3E',
    tag: '51E83F077D9C2D94',
    tampered: true
  }, {
    key: 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF',
    iv: '00000007060504A0A1A2A3A4A5',
    plain: '0C0D0E0F101112131415161718191A1B1C1D1E1F',
    aad: '000102030405060708090A0B',
    ct: 'DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F',
    tag: '51E83F077D9C2D93',
    tampered: true
  }, { // CCM-128-AES-256
    key: '0000000000000000000000000000000000000000000000000000000000000000',
    iv: '000000000000000000000000',
    plain: '00000000000000000000000000000000',
    aad: '00000000000000000000000000000000',
    ct: 'c1944044c8e7aa95d2de9513c7f3dd8c',
    tag: '87314e9c1fa01abe6a6415943dc38521',
    tampered: false
  }, { // CCM-128-AES-256
    key: '404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f',
    iv: '101112131415161718191a1b',
    plain: '202122232425262728292a2b2c2d2e2f3031323334353637',
    aad: '000102030405060708090a0b0c0d0e0f10111213',
    ct: '04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e5',
    tag: '9bba3f3a107f3239bd63902923f80371',
    tampered: false
  }, { // CCM-128-AES-256
    key: '404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f',
    iv: '101112131415161718191a1b',
    plain: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
    aad: '202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f',
    ct: '24d8a38e939d2710cad52b96fe6f82010014c4c43b2e55c557d69f0402e0d6f206c53d6cbd3f1c3c6de5dcdcad9fb74f25741dea741149fe4278a0cc24741e8658cc0523b8d7838c60fb1de4b7c3941f5b26dea9322aa29656ec37ac18a9b108a6f38b7917f5a9c398838b22afbd17252e96694a9e6237964a0eae21c0a6e15215a0e82022926be97268249599e456e05029c3ebc07d78fc5b4a0862e04e68c29514c7bdafc4b52e04833bf30622e4eb42504a44a9dcbc774752de7bb82891ad1eba9dc3281422a8aba8654268d3d9c81705f4c5a531ef856df5609a159af738eb753423ed2001b8f20c23725f2bef18c409f7e52132341f27cb8f0e79894dd9',
    tag: 'ebb1fa9d28ccfe21bdfea7e6d91e0bab',
    tampered: false
  }, { // CCM-128-AES-256
    key: '404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f',
    iv: '101112131415161718191a1b',
    plain: '202122232425262728292a2b2c2d2e2f3031323334353637',
    aad: '000102030405060708090a0b0c0d0e0f10111213',
    ct: '04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e5',
    tag: '9bba3f3a107f3239bd63902923f80372',
    tampered: true
  }
];

test('encrypt 01 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('e3b201a9f5b71a7a9b1ceaeccd97e70b6176aad9a4428aa5', 'hex'),
    tag: Buffer.from('484392fbc1b09951', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 02 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000004030201A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('72C91A36E135F8CF291CA894085C87E3CC15C439C9E43A3B', 'hex'),
    tag: Buffer.from('A091D56E10400916', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 03 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000003020100A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('588C979A61C663D2F066D0C2C0F989806D5F6B61DAC384', 'hex'),
    tag: Buffer.from('17E8D12CFDF926E0', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 04 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000005040302A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('51B1E5F44A197D1DA46B0F8E2D282AE871E838BB64DA859657', 'hex'),
    tag: Buffer.from('4ADAA76FBD9FB0C5', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 05 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000006050403A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('A28C6865939A9A79FAAA5C4C2A9D4A91CDAC8C', 'hex'),
    tag: Buffer.from('96C861B9C9E61EF1', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 06 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3E', 'hex'),
    tag: Buffer.from('51E83F077D9C2D93', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 07 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F', 'hex'),
    tag: Buffer.from('51E83F077D9C2D94', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.false(res.ciphertext.equals(test.ct));
  t.false(res.auth_tag.equals(test.tag));
});

test('encrypt 08 - CCM-128-AES-128', t => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F', 'hex'),
    tag: Buffer.from('51E83F077D9C2D93', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length / 2
  );

  t.false(res.ciphertext.equals(test.ct));
  t.false(res.auth_tag.equals(test.tag));
});

test('encrypt 09 - CCM-128-AES-256', t => {
  const test = {
    key: Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
    iv: Buffer.from('000000000000000000000000', 'hex'),
    plain: Buffer.from('00000000000000000000000000000000', 'hex'),
    aad: Buffer.from('00000000000000000000000000000000', 'hex'),
    ct: Buffer.from('c1944044c8e7aa95d2de9513c7f3dd8c', 'hex'),
    tag: Buffer.from('87314e9c1fa01abe6a6415943dc38521', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 10 - CCM-128-AES-256', t => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e5', 'hex'),
    tag: Buffer.from('9bba3f3a107f3239bd63902923f80371', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 11 - CCM-128-AES-256', t => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', 'hex'),
    aad: Buffer.from('202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f', 'hex'),
    ct: Buffer.from('24d8a38e939d2710cad52b96fe6f82010014c4c43b2e55c557d69f0402e0d6f206c53d6cbd3f1c3c6de5dcdcad9fb74f25741dea741149fe4278a0cc24741e8658cc0523b8d7838c60fb1de4b7c3941f5b26dea9322aa29656ec37ac18a9b108a6f38b7917f5a9c398838b22afbd17252e96694a9e6237964a0eae21c0a6e15215a0e82022926be97268249599e456e05029c3ebc07d78fc5b4a0862e04e68c29514c7bdafc4b52e04833bf30622e4eb42504a44a9dcbc774752de7bb82891ad1eba9dc3281422a8aba8654268d3d9c81705f4c5a531ef856df5609a159af738eb753423ed2001b8f20c23725f2bef18c409f7e52132341f27cb8f0e79894dd9', 'hex'),
    tag: Buffer.from('ebb1fa9d28ccfe21bdfea7e6d91e0bab', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.is(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  t.is(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 12 - CCM-128-AES-256', t => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e4', 'hex'),
    tag: Buffer.from('9bba3f3a107f3239bd63902923f80373', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  t.false(res.ciphertext.equals(test.ct));
  t.false(res.auth_tag.equals(test.tag));
});

test('decrypt', t => {
  for (let i in TEST_CASES) {
    let test = TEST_CASES[i];
    // console.log(test);
    var dres = ccm.decrypt(
      Buffer.from(test.key, 'hex'),
      Buffer.from(test.iv, 'hex'),
      Buffer.from(test.ct, 'hex'),
      Buffer.from(test.aad, 'hex'),
      Buffer.from(test.tag, 'hex')
    );
    // console.log(dres);
    if (!test.tampered) {
      t.true(dres.auth_ok);
      t.is(dres.plaintext.toString('hex').toUpperCase(), test.plain.toUpperCase());
    } else {
      t.is(dres.auth_ok, false);
    }
  }
});
