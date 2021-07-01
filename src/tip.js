import {
  MAP_PROTOCOL_ADDRESS,
} from './constants';

class BSocialTip {
  constructor(appName) {
    if (!appName) throw new Error('App name needs to be set');
    this.appName = appName;
    this.txId = '';
    this.amount = 0;
    this.currency = 'USD';
  }

  setTxId(txId) {
    this.txId = txId;
  }

  setAmount(amount, currency = 'USD') {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }
    this.amount = amount;
    this.currency = currency;
  }

  getOps(format = 'hex') {
    if (!this.txId) throw new Error('Tip is not referencing a valid transaction');

    const ops = [];
    ops.push(MAP_PROTOCOL_ADDRESS); // MAP
    ops.push('SET');
    ops.push('app');
    ops.push(this.appName);
    ops.push('type');
    ops.push('tip');
    ops.push('context');
    ops.push('tx');
    ops.push('tx');
    ops.push(this.txId);

    if (this.amount && this.currency) {
      ops.push('currency');
      ops.push(this.currency);
      ops.push('amount');
      ops.push('' + this.amount);
    }

    return ops.map((op) => {
      return Buffer.from(op).toString(format);
    });
  }
}

export default BSocialTip;
