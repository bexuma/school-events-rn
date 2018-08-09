import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

export default class EditProfileScreen extends Component {
  static navigationOptions = {
    title: 'Профиль',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Edit профиль</Text>
      </View>
    );
  }
}