import { describe, expect, test } from '@jest/globals';

import BSocial from '../src';
import { B_PROTOCOL_ADDRESS, BPP_PROTOCOL_ADDRESS, MAP_PROTOCOL_ADDRESS } from '../src/constants';
import BSocialLike from '../src/like';

const appName = 'com.example.testapp';

describe('bsocial', () => {
  test('empty', () => {
    const bSocial = new BSocial(appName);
    const like = bSocial.like();
    expect(() => {
      like.getOps();
    }).toThrow('Like is not referencing a valid transaction');
  });

  test('simple like', () => {
    const bSocial = new BSocial(appName);
    const like = bSocial.like('_txid_');
    const ops = like.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'like',
        'context',
        'tx',
        'tx',
        '_txid_',
      ]);
  });

  test('like with emoji', () => {
    const bSocial = new BSocial(appName);
    const like = bSocial.like('_txid_', '😃');
    const ops = like.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'like',
        'context',
        'tx',
        'tx',
        '_txid_',
        'emoji',
        '😃',
      ]);
  });

  test('errors', () => {
    const bSocial = new BSocial(appName);
    expect(() => {
      new BSocial();
    }).toThrow('App name needs to be set');
    expect(() => {
      new BSocialLike();
    }).toThrow('App name needs to be set');
    expect(() => {
      bSocial.like('_txid_',1);
    }).toThrow('Invalid emoji');
  });
});
