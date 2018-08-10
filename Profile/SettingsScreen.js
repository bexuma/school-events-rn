import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, AsyncStorage, Alert } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  item: {
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Настройки',
    headerTintColor: '#0E334E',
  };


  exit = () => {Alert.alert(
    'Выйти',
    'Вы уверены, что хотите выйти из данного аккаунта?',
    [
      { text: 'Да', onPress: async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth')
      } },
      { text: 'Отмена', onPress: () => console.log('не уходим') },
    ],
    { cancelable: false }
  )}

  goToEditProfile = () => {
    return this.props.navigation.navigate('EditProfile');
  };

  goToEditAccount = () => {
    return this.props.navigation.navigate('EditAccount');
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={this.goToEditProfile}>
          <Text style={styles.label}>Профиль</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={this.goToEditAccount}>
          <Text style={styles.label}>Аккаунт</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.item}
  onPress={this.exit}
>
          <Text style={[styles.label, { color: '#26A4FF' }]}>Выйти</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
