import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';

export default class MyProfileScreen extends Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')

  };

  state = {
    name: '',
    isLoading: true
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then((user) => {
      console.log(user)
      this.setState({
        isLoading: false,
        name: JSON.parse(user).username
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Text>SDFdfds</Text>
    }

    return (
      <View>
        <Text style={{ color: 'red', fontSize: 50 }}>
          my profile! {this.state.name}
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
