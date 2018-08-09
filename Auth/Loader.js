import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';

const Loader = props => {
  const {
    loading,
    ...attributes
  } = props;

  message = () => {
    return props.text === "login" ? "Авторизируюсь..." : "Регистрируюсь..."
  }

  return (
    <Modal
      transparent={true}
      animationType={'slide'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading}
            size="large"  />
            <Text style={styles.text}>{this.message()}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: Dimensions.get('window').width - 32,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }, 
  text: {
    color: 'grey',
  },
});
export default Loader;
