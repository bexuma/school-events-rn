import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  navigator: {
    flex:1, flexDirection: 'row',
  },
  general: {
    height: 48,
    width: Dimensions.get('window').width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    backgroundColor: 'white',
  },
  unpressed: {
    borderColor: 'transparent',
  },
  pressed: {
    borderColor: '#26A4FF',
  },
  text: {
    fontWeight: '400',
  },
  unpressedText: {
    color: 'grey',
  },
  pressedText: {
    color: '#26A4FF',
  },
});

export default class Navigator extends Component {
  state = {
    history: true,
  };

  handleOnPress = () => {
    this.setState(previousState => {
      return { history: !previousState.history };
    });
    this.props.changeScreen()
  };

  render() {
    return (
      <View style={styles.navigator}>

      <TouchableOpacity onPress={this.handleOnPress}>
        <View
          style={[
            styles.general,
            !this.state.history ? styles.unpressed : styles.pressed,
          ]}>
          <Text
            style={[
              styles.text,
              !this.state.history ? styles.unpressedText : styles.pressedText,
            ]}>ИСТОРИЯ</Text>
        </View>
      </TouchableOpacity>      
      <TouchableOpacity onPress={this.handleOnPress}>
        <View
          style={[
            styles.general,
            this.state.history ? styles.unpressed : styles.pressed,
          ]}>
          <Text
            style={[
              styles.text,
              this.state.history ? styles.unpressedText : styles.pressedText,
            ]}>ПЛАНЫ</Text>
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}
