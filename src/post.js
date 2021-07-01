import ECIES from 'bsv/ecies';
import {
  B_PROTOCOL_ADDRESS,
  BPP_PROTOCOL_ADDRESS,
  MAP_PROTOCOL_ADDRESS,
} from './constants';

class BSocialPost {
  constructor(appName) {
    if (!appName) throw new Error('App name needs to be set');
    this.appName = appName;
    this.type = 'post';
    this.txId = '';

    this.texts = [];
    this.images = [];

    this.paywallMessage = '';
    this.paywallType = 'text/markdown';
    this.paywallKey = null;
    this.paywallCurrency = 'USD';
    this.paywallPayouts = '';
    this.paywallServer = '';

    this.extraMapData = {};
  }

  setType(type) {
    this.type = type;
  }

  setTxId(txId) {
    this.txId = txId;
  }

  setPaywall(paywallMessage, paywallKey, paywallPayouts, paywallServer, paywallCurrency) {
    this.paywallMessage = paywallMessage;
    this.paywallKey = paywallKey;
    this.paywallPayouts = paywallPayouts;
    this.paywallServer = paywallServer;
    this.paywallCurrency = paywallCurrency;
  }

  setPaywallType(paywallType) {
    this.paywallType = paywallType;
  }

  /**
   * Add any key->value data to the MAP part of the post
   *
   * @param key string
   * @param value string
   */
  addMapData(key, value) {
    if (typeof key !== 'string' || typeof value !== 'string') {
      throw new Error('Key and value should be a string');
    }
    this.extraMapData[key] = value;
  }

  /**
   * Add a text to the post, in B protocol format
   * @param text
   * @param type
   */
  addText(text, type = 'text/markdown') {
    if (typeof text !== 'string') throw new Error('Text should be a string');

    this.texts.push({
      text,
      type,
    });
  }

  /**
   * Alias for addText
   * @param markdown
   */
  addMarkdown(markdown) {
    // TODO check for valid markdown
    this.addText(markdown);
  }

  addImage(dataUrl) {
    const image = dataUrl.split(',');
    const meta = image[0].split(';');
    const type = meta[0].split(':');

    if (type[0] !== 'data' || meta[1] !== 'base64' || !type[1].match('image/')) {
      throw new Error('Invalid image dataUrl format');
    }

    this.images.push({
      content: Buffer.from(image[1], 'base64'),
      type: type[1],
    });
  }

  /**
   * Get the ops from this post
   *
   * @param format Optional format for the returned array (default 'hex') - uses Buffer().toString(type)
   * @returns {string[]}
   */
  getOps(format = 'hex') {
    // check for texts or images content
    const hasContent = this.texts.length > 0 || this.images.length > 0;
    const isRepost = this.type === 'repost' && this.txId;
    if (!hasContent && !isRepost) {
      throw new Error('There is no content for this post');
    }

    const ops = [];

    if (this.texts.length > 0) {
      this.texts.forEach((t) => {
        ops.push(B_PROTOCOL_ADDRESS); // B
        ops.push(t.text);
        ops.push(t.type);
        ops.push('UTF-8');
        ops.push('|');
      });
    }

    if (this.paywallMessage && this.paywallKey) {
      const ecies = new ECIES();
      ecies.publicKey(this.paywallKey.toPublicKey());
      const encryptedText = ecies.encrypt(this.paywallMessage)
        .toString('base64');
      ops.push(B_PROTOCOL_ADDRESS); // B
      ops.push(encryptedText);
      ops.push(`application/bitcoin-ecies; content-type="${this.paywallType}"`);
      ops.push('UTF-8');
      ops.push('|');

      ops.push(BPP_PROTOCOL_ADDRESS); // B
      ops.push('PAY');
      ops.push(this.paywallCurrency);
      ops.push(this.paywallPayouts);
      ops.push(this.paywallServer);
      ops.push('|');
    }

    if (this.images.length > 0) {
      this.images.forEach((image) => {
        // image.content is in dataUrl format
        ops.push(B_PROTOCOL_ADDRESS); // B
        ops.push(image.content);
        ops.push(image.type);
        ops.push('|');
      });
    }

    ops.push(MAP_PROTOCOL_ADDRESS); // MAP
    ops.push('SET');
    ops.push('app');
    ops.push(this.appName);
    ops.push('type');
    ops.push(this.type);

    if (this.txId) {
      // reply
      if (this.type !== 'repost') {
        // a repost does not need the context set
        ops.push('context');
        ops.push('tx');
      }
      ops.push('tx');
      ops.push(this.txId);
    }

    const extraMapData = Object.keys(this.extraMapData);
    if (extraMapData.length) {
      extraMapData.forEach((key) => {
        ops.push(key);
        ops.push(this.extraMapData[key]);
      });
    }

    return ops.map((op) => {
      return (Buffer.isBuffer(op) ? op : Buffer.from(op)).toString(format);
    });
  }
}

export default BSocialPost;
