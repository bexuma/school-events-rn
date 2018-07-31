import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class MyProfileScreen extends Component {
  render() {
    return (
      <View>
        <Text style={{ color: 'red', fontSize: 50 }}>my profile!</Text>
        <Button
          title="logout"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    );
  }
}
