import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';

export default class MyProfileScreen extends Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')

  };

  render() {
    return (
      <View>
        <Text style={{ color: 'red', fontSize: 50 }}>my profile!</Text>
        <Button
          title="logout"
          onPress={
            this._signOutAsync
          }
        />
      </View>
    );
  }
}
