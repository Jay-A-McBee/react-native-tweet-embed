# react-native-tweet-embed
[![npm version](https://badge.fury.io/js/react-native-tweet-embed.svg)](https://badge.fury.io/js/react-native-tweet-embed)

Embed a specific tweet in a React Native view

## Installation

```sh
yarn add react-native-tweet-embed
```

or

```sh
npm install --save react-native-tweet-embed
```

This component uses a native ios and Android module to optimize fetching the twitter widget js blob.

## requires react-native version >= v60

Linking is handled automatically. You must install pods only.

```sh
cd ios && pod install
```

## Usage

```js
import { TweetEmbed } from 'react-native-tweet-embed';
// ...

<TweetEmbed tweetId={'1236076554909872128'} />;
```


<img src="assets/tweet_embed.gif" width="250" height="500" alt="react native tweet embed on ios simulator">

## License

MIT
