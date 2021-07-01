import bsv from 'bsv';
import BSocialPost from './post';
import BSocialLike from './like';
import BSocialTip from './tip';
import BSocialFollow from './follow';

export const B_PROTOCOL_ADDRESS = '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut';
export const MAP_PROTOCOL_ADDRESS = '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5';
export const AIP_PROTOCOL_ADDRESS = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';
export const BAP_PROTOCOL_ADDRESS = '1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT';
export const BPP_PROTOCOL_ADDRESS = 'BPP';

class BSocial {
  constructor(appName) {
    if (!appName) throw new Error('App name needs to be set');
    this.appName = appName;
  }

  /**
   * Initialize a new post
   *
   * @returns {BSocialPost}
   */
  post() {
    return new BSocialPost(this.appName);
  }

  /**
   * Initialize a new repost
   *
   * @returns {BSocialPost}
   */
  repost(txId) {
    const post = new BSocialPost(this.appName);
    post.setType('repost');
    post.setTxId(txId);
    return post;
  }

  /**
   * Initialize a new reply
   *
   * @param txId The transaction that is being replied to
   * @returns {BSocialPost}
   */
  reply(txId) {
    const post = new BSocialPost(this.appName);
    post.setTxId(txId);
    return post;
  }

  /**
   * Initialize a new paywall post
   *
   * The payouts need to be a comma seperated list of Bitcoin addresses, each with an amount separated by a colon (':')
   *
   * @param paywallMessage The paywalled message (markdown is assumed, use setPaywallType() to override)
   * @param paywallKey A WIF formatted private key to use for the paywall
   * @param paywallPayouts The payouts that are needed for this paywall (1bsoShMdRZJ4UH3GFWcJqkkGBFzJPLHPr:0.10,1bso2esN3J9EMyag3TimEEE8GKXJQkecd:0.02)
   * @param paywallServer The API url of the paywall server
   * @param paywallCurrency The currency the paywallPayouts are in (example 'USD', 'DURO', 'BSV')
   * @returns {BSocialPost}
   */
  paywall(paywallMessage, paywallKey, paywallPayouts, paywallServer, paywallCurrency = 'USD') {
    // This will throw if the key is not valid
    const privateKey = bsv.PrivateKey.fromWIF(paywallKey);

    const post = new BSocialPost(this.appName);
    post.setPaywall(paywallMessage, privateKey, paywallPayouts, paywallServer, paywallCurrency);

    return post;
  }

  like(txId, emoji = '') {
    const like = new BSocialLike(this.appName);
    like.setTxId(txId);
    if (emoji) {
      like.setEmoji(emoji);
    }

    return like;
  }

  tip(txId, amount = 0, currency = 'USD') {
    const tip = new BSocialTip(this.appName);
    tip.setTxId(txId);
    if (amount && currency) {
      tip.setAmount(amount, currency);
    }

    return tip;
  }

  follow(idKey) {
    const follow = new BSocialFollow(this.appName);
    follow.setIdKey(idKey);

    return follow;
  }

  unfollow(idKey) {
    const follow = new BSocialFollow(this.appName);
    follow.setIdKey(idKey);

    follow.setAction('unfollow');

    return follow;
  }
}

export default BSocial;
