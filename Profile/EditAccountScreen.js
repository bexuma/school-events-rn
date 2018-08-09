import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

export default class EditAccountScreen extends Component {
  static navigationOptions = {
    title: 'Аккаунт',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Edit Account</Text>
      </View>
    );
  }
}
