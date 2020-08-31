import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';

import {WebView} from 'react-native-webview';
import ProgressBar from 'react-native-progress/Bar';

const pressable_android_ripple_config = {
  color: '#808080',
  borderless: false,
  radius: 100,
};

class WebviewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      uri: '',
      title: '',
      loadingBarWidth: -1,
      sitesList: [
        {uri: 'https://livesport.ws/en', title: 'livesport'},
        {uri: 'https://hoofoot.com', title: 'hoofoot'},
        {uri: 'https://google.com', title: 'google'},
        {uri: 'https://facebook.com', title: 'facebook'},
      ],
    };
    this.webViewRef = React.createRef();
  }

  onSearchGoPress = (uri, title) => {
    this.setState({uri: uri, title: title});
  };

  render() {
    console.log('#### render:WebviewContainer');

    return (
      <View style={{flex: 1}}>
        <SearchBar
          uri={this.state.uri}
          title={this.state.title}
          loadingBarWidth={this.state.loadingBarWidth}
          onSearchGoPress={this.onSearchGoPress}
          goBack={() =>
            this.webViewRef.current && this.webViewRef.current.goBack()
          }
          reload={() =>
            this.webViewRef.current && this.webViewRef.current.reload()
          }
          goForward={() =>
            this.webViewRef.current && this.webViewRef.current.goForward()
          }
          stopLoading={() =>
            this.webViewRef.current && this.webViewRef.current.stopLoading()
          }
        />
        {/* <LoadingView loadingBarWidth={this.state.loadingBarWidth} /> */}
        <ProgressBar
          progress={this.state.loadingBarWidth}
          indeterminate={this.state.loadingBarWidth < 0 ? true : false}
          width={null}
          height={4}
          borderRadius={0}
          color={this.state.loadingBarWidth < 1 ? 'red' : '#fff'}
          borderWidth={0}
        />

        {this.state.uri === '' ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginBottom: 15,
                width: '50%',
              }}>
              Bookmarks:
            </Text>
            {this.state.sitesList.map((value, index) => (
              <Pressable
                key={value.title + index}
                onPress={() =>
                  this.setState({uri: value.uri, title: value.title})
                }
                android_ripple={pressable_android_ripple_config}
                style={{
                  borderRadius: 1,
                  elevation: 1,
                  width: '50%',
                  // borderWidth: 1,
                  marginBottom: 15,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>{value.title}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <WebView
            ref={this.webViewRef}
            source={{uri: this.state.uri}}
            thirdPartyCookiesEnabled={false}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            incognito={true}
            onLoadProgress={({nativeEvent}) => {
              console.log('><onLoadProgress', nativeEvent);
              this.setState({loadingBarWidth: nativeEvent.progress});
            }}
            onNavigationStateChange={(navState) => {
              console.log('onNavigationStateChange', navState);
              if (navState.loading) {
                this.setState({uri: navState.url});
              } else {
                this.setState({uri: navState.url});
              }
            }}
            onShouldStartLoadWithRequest={(request) => {
              console.log('onShouldStartLoadWithRequest', request);
              if (
                this.state.title != '' &&
                request.url.indexOf(this.state.title) < 0
              )
                return false;
              else return true;
            }}
          />
        )}
      </View>
    );
  }
}

function LoadingView(props) {
  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        // opacity: 0.5,
        elevation: 2,
        maxHeight: 5,
        backgroundColor: '#ccc',
      }}>
      <View
        style={{
          height: '100%',
          width: '' + props.loadingBarWidth + '%',
          backgroundColor: props.loadingBarWidth < 100 ? '#843b62' : '#fff',
        }}
      />
    </View>
  );
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPropsUri: props.uri,
      uri: props.uri,
      title: props.title,
      isTextInputFocused: false,
    };
    this.searchInputRef = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log('getDerivedStateFromProps', props, state);
    if (props.uri !== state.prevPropsUri && props.uri !== state.uri) {
      return {
        prevPropsUri: props.uri,
        uri: props.uri,
      };
    }
    return null;
  };

  submitSearch = () => {
    console.log('press');
    Keyboard.dismiss();
    this.searchInputRef.current.blur();
    this.props.onSearchGoPress(this.state.uri, '');
    this.setState({isTextInputFocused: false});
  };

  render() {
    console.log('#### render:SearchBar ', this.state, this.props);
    return (
      <View style={{flex: 1, flexDirection: 'row', maxHeight: 37}}>
        <TextInput
          ref={this.searchInputRef}
          style={{
            flex: 1,
            // borderBottomWidth: 1,
            elevation: 1,
            height: 35,
            margin: 1,
            padding: 0,
            paddingLeft: 10,
            borderRadius: 1,
          }}
          value={this.state.uri}
          onChangeText={(text) => {
            this.setState({uri: text});
          }}
          keyboardType="email-address"
          returnKeyType="go"
          returnKeyLabel="Go"
          selectTextOnFocus={true}
          onFocus={() => this.setState({isTextInputFocused: true})}
          onblur={() => this.setState({isTextInputFocused: false})}
          onEndEditing={() => this.setState({isTextInputFocused: false})}
          onSubmitEditing={this.submitSearch}
        />
        <View style={{flexDirection: 'row'}}>
          {this.state.isTextInputFocused ? (
            <Pressable
              key="go"
              onPress={this.submitSearch}
              android_ripple={pressable_android_ripple_config}
              style={Styles.navBtn}>
              <Text>Go</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                key="<"
                android_ripple={pressable_android_ripple_config}
                style={Styles.navBtn}
                onPress={() => {
                  console.log('press <');
                  this.props.goBack();
                }}>
                <Text>{'<'}</Text>
              </Pressable>
              {this.props.loadingBarWidth < 1 ? (
                <Pressable
                  key="x"
                  android_ripple={pressable_android_ripple_config}
                  style={Styles.navBtn}
                  onPress={() => {
                    console.log('press x');
                    this.props.stopLoading();
                  }}>
                  <Text>x</Text>
                </Pressable>
              ) : (
                <Pressable
                  key="x"
                  android_ripple={pressable_android_ripple_config}
                  style={Styles.navBtn}
                  onPress={() => {
                    console.log('press Reload');
                    this.props.reload();
                  }}>
                  <Text>G</Text>
                </Pressable>
              )}

              <Pressable
                key=">"
                android_ripple={pressable_android_ripple_config}
                style={Styles.navBtn}
                onPress={() => {
                  console.log('press >');
                  this.props.goForward();
                }}>
                <Text>{'>'}</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  navBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 1,
    elevation: 1,
    margin: 1,
  },
});

export default WebviewContainer;
