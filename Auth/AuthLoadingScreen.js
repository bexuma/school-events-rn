import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }


  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const user = await AsyncStorage.getItem('user');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(user ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <ImageBackground source={require('../loadingLogo.png')} style={{width: '100%', height: '100%'}}/>
    );
  }
}