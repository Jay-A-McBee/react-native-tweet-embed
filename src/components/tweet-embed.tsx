import React from 'react';
import { Linking, Animated, NativeModules, Platform } from 'react-native';
import WebView, {
  WebViewNavigation,
  WebViewMessageEvent
} from 'react-native-webview';
import { LoadingIndicator } from './loading-indicator';

const LINKING_ERROR =
  `The package 'react-native-tweet-embed' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const WidgetHandle = NativeModules.TweetEmbed
  ? NativeModules.TweetEmbed
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        }
      }
    );

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

const TweetEmbed: React.FC<{ tweetId: string }> = ({ tweetId }) => {
  const [state, setState] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWidgetJs = async () => {
      const js = await WidgetHandle.fetchWidgetJs();
      setState(js);
    };

    fetchWidgetJs();
  }, []);

  // dynamic css values
  const height = React.useRef(new Animated.Value(200));
  const opacity = React.useRef(new Animated.Value(0));
  // access to stopLoading method
  const webViewHandle = React.useRef<WebView>(null);

  const handleMessage = React.useCallback((event: WebViewMessageEvent) => {
    Animated.parallel([
      Animated.timing(height.current, {
        toValue: parseInt(event.nativeEvent.data, 10) + 20,
        duration: 500,
        useNativeDriver: false
      }),
      Animated.timing(opacity.current, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false
      })
    ]).start();
  }, []);

  const onNavigationStateChange = React.useCallback(
    async ({ url }: WebViewNavigation) => {
      if (!ABOUT_BLANK_PATTERN.test(url) && webViewHandle.current) {
        try {
          webViewHandle.current.stopLoading();
          await Linking.openURL(url);
        } catch (e) {
          console.log(e);
        }
      }
    },
    []
  );

  const createTweet = React.useMemo(() => {
    return `
     ${state}

     try{
       twttr.widgets.createTweet(
         '${tweetId}',
         document.getElementById('wrapper'),
         { align: 'center' }
       ).then(el => {
         console.log("el", el);
           window.ReactNativeWebView.postMessage(el.offsetHeight);
       })
     }catch(e){}
      
      true
    `;
  }, [tweetId, state]);

  return (
    <>
      <LoadingIndicator isLoading={!state} />
      <Animated.View
        style={{
          width: '100%',
          height: height.current,
          opacity: opacity.current
        }}
      >
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
