import { describe, expect, test } from '@jest/globals';

import BSocial, { B_PROTOCOL_ADDRESS, BPP_PROTOCOL_ADDRESS, MAP_PROTOCOL_ADDRESS } from '../src';
import BSocialTip from '../src/tip';

const appName = 'com.example.testapp';

describe('bsocial', () => {
  test('empty', () => {
    const bSocial = new BSocial(appName);
    const tip = bSocial.tip();
    expect(() => {
      tip.getOps();
    }).toThrow('Tip is not referencing a valid transaction');
  });

  test('simple tip', () => {
    const bSocial = new BSocial(appName);
    const tip = bSocial.tip('_txid_');
    const ops = tip.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'tip',
        'context',
        'tx',
        'tx',
        '_txid_',
      ]);
  });

  test('tip with amount', () => {
    const bSocial = new BSocial(appName);
    const tip = bSocial.tip('_txid_', 200, 'DURO');
    const ops = tip.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'tip',
        'context',
        'tx',
        'tx',
        '_txid_',
        'currency',
        'DURO',
        'amount',
        '200'
      ]);
  });

  test('errors', () => {
    const bSocial = new BSocial(appName);
    expect(() => {
      new BSocial();
    }).toThrow('App name needs to be set');
    expect(() => {
      new BSocialTip();
    }).toThrow('App name needs to be set');
    expect(() => {
      bSocial.tip('_txid_', -1, 'BOO');
    }).toThrow('Invalid amount');
    expect(() => {
      const tip = new BSocialTip('app');
      tip.setAmount(-1);
    }).toThrow('Invalid amount');
  });
});
