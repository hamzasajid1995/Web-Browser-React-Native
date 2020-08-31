/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import WebviewContainer from './Components/WebviewContainer';

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <WebviewContainer />
      </SafeAreaView>
    </>
  );
};

export default App;
