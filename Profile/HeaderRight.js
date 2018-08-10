import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightIcons: {
    paddingRight: 20,
  },
});

export default class HeaderRight extends Component {
  handleOnPress = () => {
    return this.props.navigation.navigate('Settings');
  };

  render() {
    return (
      <View style={styles.headerRight}>
        {/* <View style={styles.headerRightIcons}>
          <TouchableOpacity>
            <Ionicons name="ios-bookmark" size={28} color="#fff" />
          </TouchableOpacity>
        </View> */}
        <View style={styles.headerRightIcons}>
          <TouchableOpacity onPress={this.handleOnPress}>
            <Ionicons name="ios-settings" size={28} color="#0E334E" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
