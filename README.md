# BSocial
> A javascript library to create bsocial (BitcoinSchema) compatible transactions.

## Usage

This library returns an hexArray of ops using the Bitcom convention

### Post

```javascript
import BSocial from 'bsocial';
const bsocial = new BSocial('app name');

const post = bSocial.post();
post.addText('Hello World!');

const hexArrayOps = post.getOps();
```

### Post with an image

```javascript
import BSocial from 'bsocial';
const bsocial = new BSocial('app name');

const post = bSocial.post();
post.addText('Hello World!');
// and image data Url
post.addImage('data:image/png,.....;base64');

const hexArrayOps = post.getOps();
```

### Post with a paywall

```javascript
import bsv from 'bsv';
import BSocial from 'bsocial';
const bsocial = new BSocial('app name');
const apiUrl = 'https://example.com/v1/';

// store this key in a database for retreival via the API URL when someone pays
const key = bsv.PrivateKey.fromRandom().toWIF();
const payTo = '1bsoShMdRZJ4UH3GFWcJqkkGBFzJPLHPr:0.10';
const post = bSocial.paywall(
  'Some text you want to be paid for',
  key,
  payTo,
  apiUrl,
);
post.setPaywallType('text/plain');

// Adding a text will be prepended as the first element in the post
post.addText('Intro text for the paywall. Maybe first paragraph');

const hexArrayOps = post.getOps();
```
