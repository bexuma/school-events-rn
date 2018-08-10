import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

export default class EditProfileScreen extends Component {
  static navigationOptions = {
    title: 'Профиль',
    headerTintColor: '#0E334E',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Edit профиль</Text>
      </View>
    );
  }
}