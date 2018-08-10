import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  followButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  general: {
    height: 32,
    width: 252,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26A4FF',
  },
  unpressed: {
    backgroundColor: 'white',
  },
  pressed: {
    backgroundColor: '#26A4FF',
  },
  text: {
    fontWeight: '400',
  },
  unpressedText: {
    color: '#26A4FF',
  },
  pressedText: {
    color: 'white',
  },
});

export default class FollowButton extends Component {
  state = {
    pressed: false,
  };

  handleOnPress = () => {
    this.setState(previousState => {
      return { pressed: !previousState.pressed };
    });
  };

  render() {
    return (
      <View style = {styles.followButton}>
      <TouchableOpacity onPress={this.handleOnPress}>
        <View
          style={[
            styles.general,
            !this.state.pressed ? styles.unpressed : styles.pressed,
          ]}>
          <Text
            style={[
              styles.text,
              !this.state.pressed ? styles.unpressedText : styles.pressedText,
            ]}>
            {!this.state.pressed ? 'Подписаться' : 'Вы подписаны'}
          </Text>
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}
