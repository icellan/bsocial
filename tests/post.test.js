import bsv from 'bsv';
import { describe, expect, test } from '@jest/globals';

import BSocial, { B_PROTOCOL_ADDRESS, BPP_PROTOCOL_ADDRESS, MAP_PROTOCOL_ADDRESS } from '../src';
import BSocialPost from '../src/post';

const appName = 'com.example.testapp';

describe('bsocial', () => {
  test('empty', () => {
    const bSocial = new BSocial(appName);
    const post = bSocial.post();
    expect(() => {
      post.getOps();
    })
      .toThrow('There is no content for this post');
  });

  test('simple text', () => {
    const bSocial = new BSocial(appName);
    const testText = 'test 123';

    const post = bSocial.post();
    post.addText(testText);

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        B_PROTOCOL_ADDRESS,
        testText,
        'text/markdown',
        'UTF-8',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
      ]);
  });

  test('multiple texts', () => {
    const bSocial = new BSocial(appName);
    const testText = 'test 123';
    const testText2 = 'test **321**';

    const post = bSocial.post();
    post.addText(testText, 'text/plain');
    post.addMarkdown(testText2);

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        B_PROTOCOL_ADDRESS,
        testText,
        'text/plain',
        'UTF-8',
        '|',
        B_PROTOCOL_ADDRESS,
        testText2,
        'text/markdown',
        'UTF-8',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
      ]);
  });

  test('extra meta data', () => {
    const bSocial = new BSocial(appName);
    const testText = 'test 123';

    const post = bSocial.post();
    post.addText(testText);
    post.addMapData('internalId', '123');

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        B_PROTOCOL_ADDRESS,
        testText,
        'text/markdown',
        'UTF-8',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
        'internalId',
        '123',
      ]);
  });

  test('reply', () => {
    const bSocial = new BSocial(appName);
    const testText = 'test 123';

    const post = bSocial.reply('_txid_');
    post.addText(testText);

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        B_PROTOCOL_ADDRESS,
        testText,
        'text/markdown',
        'UTF-8',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
        'context',
        'tx',
        'tx',
        '_txid_',
      ]);
  });

  test('repost', () => {
    const bSocial = new BSocial(appName);
    const post = bSocial.repost('_txid_');

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'repost',
        'tx',
        '_txid_',
      ]);
  });

  test('simple image', () => {
    const bSocial = new BSocial(appName);
    const post = bSocial.post();

    const testContent = 'Hello, World!';
    const dataUrl = `data:image/png;base64,${Buffer.from(testContent)
      .toString('base64')}`;
    post.addImage(dataUrl);

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        B_PROTOCOL_ADDRESS,
        testContent,
        'image/png',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
      ]);
  });

  test('text & image', () => {
    const bSocial = new BSocial(appName);
    const post = bSocial.post();

    post.addMarkdown('test *this* image + text');

    const testContent = 'Hello, World!';
    const dataUrl = `data:image/png;base64,${Buffer.from(testContent)
      .toString('base64')}`;
    post.addImage(dataUrl);

    const ops = post.getOps();
    expect(ops.map(o => Buffer.from(o, 'hex')
      .toString()))
      .toEqual([
        B_PROTOCOL_ADDRESS,
        'test *this* image + text',
        'text/markdown',
        'UTF-8',
        '|',
        B_PROTOCOL_ADDRESS,
        testContent,
        'image/png',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
      ]);
  });

  test('invalid image', () => {
    const bSocial = new BSocial(appName);
    const post = bSocial.post();
    expect(() => {
      post.addImage('test 123');
    })
      .toThrow('Invalid image dataUrl format');
  });

  test('paywall', () => {
    const bSocial = new BSocial(appName);
    const key = bsv.PrivateKey.fromRandom()
      .toWIF();
    const post = bSocial.paywall(
      'test 123',
      key,
      '1bsoShMdRZJ4UH3GFWcJqkkGBFzJPLHPr:0.10',
      'https://example.com/v1/',
    );
    post.setPaywallType('text/plain');

    const testText = 'Summary text before paywall or first free paragraph';
    post.addText(testText, 'text/plain');

    const ops = post.getOps();
    let opsTxt = ops.map(o => Buffer.from(o, 'hex')
      .toString());

    // the encrypted content is always different, need to check differently
    const encrypted = opsTxt[6];
    expect(typeof encrypted)
      .toBe('string');
    opsTxt[6] = 'test 123 - encrypted';
    expect(opsTxt)
      .toEqual([
        B_PROTOCOL_ADDRESS,
        testText,
        'text/plain',
        'UTF-8',
        '|',
        B_PROTOCOL_ADDRESS,
        'test 123 - encrypted',
        'application/bitcoin-ecies; content-type="text/plain"',
        'UTF-8',
        '|',
        BPP_PROTOCOL_ADDRESS,
        'PAY',
        'USD',
        '1bsoShMdRZJ4UH3GFWcJqkkGBFzJPLHPr:0.10',
        'https://example.com/v1/',
        '|',
        MAP_PROTOCOL_ADDRESS,
        'SET',
        'app',
        appName,
        'type',
        'post',
      ]);
  });

  test('errors', () => {
    const bSocial = new BSocial(appName);
    const post = bSocial.post();
    expect(() => {
      new BSocial();
    }).toThrow('App name needs to be set');
    expect(() => {
      new BSocialPost();
    }).toThrow('App name needs to be set');
    expect(() => {
      post.addText(123);
    }).toThrow('Text should be a string');
    expect(() => {
      post.addMapData(false, 123);
    }).toThrow('Key and value should be a string');
  });
});
