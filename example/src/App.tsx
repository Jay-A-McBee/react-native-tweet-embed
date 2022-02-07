import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TweetEmbed } from 'react-native-tweet-embed';

const App: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>react-native-tweet-embed</Text>
    <View style={{ height: 20 }} />
    <TweetEmbed tweetId={'1236076554909872128'} />
  </View>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#364661',
  },
  title: {
    fontSize: 30,
    color: '#44e394',
  },
});
