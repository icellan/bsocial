# Bitcoin SOCIAL - BitcoinSchema

The Bitcoin SOCIAL protocol is a protocol for a global distributed uncensorable blockchain based open social media network where all users own their own data.

Anyone with a wallet and a few cents of Bitcoin can post, reply, like and share on any of the connected clients, directly from the command line or from a specialized post only app.

Bitcoin SOCIAL is based on the work of Satchmo on the `MAP` (https://github.com/rohenaz/MAP) protocol.

## Technical description

The protocol makes use of existing `Bitcom` protocols (https://bitcom.bitdb.network/) that are in wide use on Bitcoin. The main protocols are `B` (https://b.bitdb.network/), `MAP` (https://github.com/rohenaz/MAP), `AIP` (https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL) and `BAP` (https://github.com/icellan/bap).

The SOCIAL clients should be indexing all transactions that include `MAP SET app <appname> type`, for all `<appname>'s`. The `<appname>` should be set to the domain of the app that posting (for instance `blockpost.network`).

The main structure of all social transactions is:

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type <action>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

The `BAP` protocol is used for identity purposes. Anyone can post freely with any address, but for people to be able to follow others, it is preferable for a  BAP identity to be set up to allow identifying which posts are coming from whom, while still being able to rotate signing keys.

### Post

To create a new social post (tweet, blog, image, video) the MAP `type` should be set to `post`

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type post
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

### Like

To add a like to an existing post, `type` should be set to `like` and the transaction of the original post linked.

```
MAP SET app <appname> type like contex tx tx <txHash>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

Alternatively, an emoji (in utf-8) can be added to the `like` action, but it is not guaranteed that all sites will parse it.

```
MAP SET app <appname> type like contex tx tx <txHash> emoji 😃
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

### Reply

To reply to a post, `type` should be set to `post` and a context added for the transaction of the original post. 

```
B <content> <mediaType> <encoding>
| MAP SET app <appname> type post context tx tx <txHash>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

### Re-post (re-tweet)

To create a new post as a re-post of an existing post, `type` should be set to `repost`. 

```
MAP SET app <appname> type repost tx <txHash>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

### Tags

Tags can be added to an `post` and `repost`.

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type post tag social
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

When adding multiple tags to a post, use the `:::` to use a `MAP` `ADD` command

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type post ::: ADD tag bitcoin social rules
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

### Follow / Unfollow

Declare a follow or unfollow to another user.

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type follow context bap idkey <BAP idKey>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type unfollow context bap idkey <BAP idKey>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

### Attaching extra data

It is also possible to add more data to a `post`, `reply` or `repost` by adding more attachments using the `B` protocol.

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| B <content> <mediaType> <encoding>
| MAP SET app <appname> type post
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

or adding new attachments in separate transactions, where `<txHash>` is the transaction hash of the original post. The address used for signing in the AIP protocol should be the same as the original post.

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type attachment context tx tx <txHash>
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

## Markup of text posts

Since there will be a lot of different clients, on different platforms and OS's, any text should preferably use Markdown for formatted text. Not all clients will support all encodings, but all should support at least `text/plain` and `text/markdown` ([https://en.wikipedia.org/wiki/Markdown](https://en.wikipedia.org/wiki/Markdown)).

## Origin verification

It's possible to include app origin verification information in the transaction posted. This can be useful to prove in a verifiable the origin of a transaction.

To add verification, the `MAP SET` command should include a key `bab-id <identity key>` for the identity of the site. The transaction should then also be signed with a key belonging to that identity.

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> bap-id <identity key> type <action> [... other keys]
| AIP <Signing Algorithm> <Signing Address of user> <Signature>
| AIP <Signing Algorithm> <Signing Address of identity key> <Signature>
```

## Internationalization (i18n)

Preferably all posts would include some information about where they are coming from and in which language they are written in. If nothing is given, the English language is assumed in a global context.

```
OP_FALSE OP_RETURN
B <content> <mediaType> <encoding>
| MAP SET app <appname> type post language zho country chn
| AIP <Signing Algorithm> <Signing Address> <Signature>
```

The language codes should use the ISO 639-2, 3 character standard ([https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes));

The country codes should use the ISO 3166-1, 3 character standard ([https://en.wikipedia.org/wiki/ISO_3166-1](https://en.wikipedia.org/wiki/ISO_3166-1))
