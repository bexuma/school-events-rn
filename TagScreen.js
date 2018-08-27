import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Dimensions,
  Image,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  Feather,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

Capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default class TagScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: Capitalize(navigation.state.params.tag.name),
    headerRight: (
      <SimpleLineIcons
        style={{ paddingRight: 12 }}
        name="options-vertical"
        size={20}
        color="#0E334E"
      />
    ),
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#0E334E',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  });

  state = {
  };


  render() {
    const tag = this.props.navigation.getParam(
      'tag',
      'tag is not found in props'
    );

    console.log(tag)

    return (
      <Text>{tag.name}</Text>
    );
  }
}

const styles = StyleSheet.create({
  
});
