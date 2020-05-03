import React from 'react';
import { Linking, Animated } from 'react-native';
import WebView, {
  WebViewNavigation,
  WebViewMessageEvent,
} from 'react-native-webview';

import { useTwitterWidgetJS } from './useTwitterWidgetJS';
import { LoadingIndicator } from './loading-indicator';

const ABOUT_BLANK_PATTERN = /about:blank/;

const htmlTemplate = `
  <html>
    <head>
      <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'>
    </head>
    <body>
      <div id="wrapper"></div>
    </body>
  </html>
`;

const TweetEmbed: React.FC<{
  tweetId: string;
  onMessage?: (event: WebViewMessageEvent) => void;
  onNavigationChange?: (event: WebViewNavigation) => void;
}> = ({ tweetId, onMessage, onNavigationChange }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  // dynamic css values
  const height = React.useRef(new Animated.Value(200));
  const opacity = React.useRef(new Animated.Value(0));
  // access to stopLoading method
  const webViewHandle = React.useRef<WebView>(null);

  const handleMessage = React.useCallback(
    (event: WebViewMessageEvent) => {
      if (onMessage) {
        onMessage(event);
      } else {
        Animated.parallel([
          Animated.timing(height.current, {
            toValue: parseInt(event.nativeEvent.data, 10) + 20,
            useNativeDriver: false,
          }),
          Animated.timing(opacity.current, {
            toValue: 1,
            useNativeDriver: false,
          }),
        ]).start();
        setIsLoading(false);
      }
    },
    [onMessage],
  );

  const onNavigationStateChange = React.useCallback(
    async (event: WebViewNavigation) => {
      try {
        if (onNavigationChange) {
          onNavigationChange(event);
        } else if (
          !ABOUT_BLANK_PATTERN.test(event.url) &&
          webViewHandle.current
        ) {
          webViewHandle.current.stopLoading();
          await Linking.openURL(event.url);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [onNavigationChange],
  );

  const { widgetJS } = useTwitterWidgetJS();

  const createTweet = React.useMemo(() => {
    return `
     ${widgetJS}

     try{
       twttr.widgets.createTweet(
         '${tweetId}',
         document.getElementById('wrapper'),
         { align: 'center' }
       ).then(el => {
           window.ReactNativeWebView.postMessage(el.offsetHeight);
       })
     }catch(e){}
      
      true
    `;
  }, [tweetId, widgetJS]);

  return (
    <>
      <LoadingIndicator isLoading={isLoading} />
      <Animated.View
        style={{
          height: height.current,
          opacity: opacity.current,
        }}>
        <WebView
          ref={webViewHandle}
          originWhitelist={['*']}
          source={{ html: htmlTemplate }}
          onMessage={handleMessage}
          onNavigationStateChange={onNavigationStateChange}
          injectedJavaScript={createTweet}
        />
      </Animated.View>
    </>
  );
};

export default TweetEmbed;
