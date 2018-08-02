import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';

export default class MyProfileScreen extends Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')

  };

  render() {
    const { navigation } = this.props;
    const user = navigation.getParam('user', 'NO-USER');

    console.log(user)

    return (
      <View>
        <Text style={{ color: 'red', fontSize: 50 }}>
          my profile! {user.email}
        </Text>
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
