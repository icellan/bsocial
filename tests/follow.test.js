import { describe, expect, test } from '@jest/globals';

import BSocial from '../src';
import { B_PROTOCOL_ADDRESS, BPP_PROTOCOL_ADDRESS, MAP_PROTOCOL_ADDRESS } from '../src/constants';
import BSocialFollow from '../src/follow';

const appName = 'com.example.testapp';

describe('bsocial', () => {
  test('empty', () => {
    const bSocial = new BSocial(appName);
    const follow = bSocial.follow();
    expect(() => {
      follow.getOps();
    }).toThrow('Follow is not referencing a valid id');
  });

  test('simple follow', () => {
    const bSocial = new BSocial(appName);
    const follow = bSocial.follow('_idKey_');
    const ops = follow.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'follow',
        'idKey',
        '_idKey_',
      ]);
  });

  test('unfollow', () => {
    const bSocial = new BSocial(appName);
    const follow = bSocial.unfollow('_idKey_');
    const ops = follow.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'unfollow',
        'idKey',
        '_idKey_',
      ]);
  });

  test('errors', () => {
    const bSocial = new BSocial(appName);
    expect(() => {
      new BSocial();
    }).toThrow('App name needs to be set');
    expect(() => {
      new BSocialFollow();
    }).toThrow('App name needs to be set');
    expect(() => {
      const follow = new BSocialFollow('app');
      follow.setAction('test');
    }).toThrow('Invalid action');
  });
});
