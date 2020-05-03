// Type definitions for [react-native-tweet-embed] [1.0.0]
// Project: [react-native-tweet-embed]
// Definitions by: [Austin McBee] <[akmcbell7@gmail.com]>
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import React from 'react';

declare module 'react-native-tweet-embed' {
  const TweetEmbed: React.FC<{
    tweetId: string;
    onMessage?: (event: WebViewMessageEvent) => void;
    onNavigationChange?: (event: WebViewNavigation) => void;
  }>;
  export = TweetEmbed;
}
