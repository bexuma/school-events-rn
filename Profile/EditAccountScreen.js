import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

export default class EditAccountScreen extends Component {
  static navigationOptions = {
    title: 'Аккаунт',
    headerTintColor: '#0E334E',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Edit Account</Text>
      </View>
    );
  }
}
