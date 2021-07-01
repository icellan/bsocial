import {
  MAP_PROTOCOL_ADDRESS,
} from './index';

class BSocialFollow {
  constructor(appName) {
    if (!appName) throw new Error('App name needs to be set');
    this.appName = appName;
    this.idKey = '';
    this.followAction = 'follow';
  }

  setIdKey(idKey) {
    this.idKey = idKey;
  }

  setAction(action) {
    if (action !== 'follow' && action !== 'unfollow') throw new Error('Invalid action');
    this.followAction = action;
  }

  getOps(format = 'hex') {
    if (!this.idKey) throw new Error('Follow is not referencing a valid id');

    const ops = [];
    ops.push(MAP_PROTOCOL_ADDRESS); // MAP
    ops.push('SET');
    ops.push('app');
    ops.push(this.appName);
    ops.push('type');
    ops.push(this.followAction);
    ops.push('idKey');
    ops.push(this.idKey);

    return ops.map(op => Buffer.from(op).toString(format));
  }
}

export default BSocialFollow;
