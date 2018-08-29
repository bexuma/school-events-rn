import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import EventItem from './Event/components/EventItem'
import { SimpleLineIcons } from '@expo/vector-icons';

const tagEventsQuery = gql`
  query($tagId: ID!) {
    eventsOfTag(
      tagId: $tagId,
    ) {
      id
      title
      description
      image_name
      participantIds
      hostedBy {
        id
        username
        avatar
      }
      site_url
      starts_at
      ends_at
      address
      latitude
      longitude
      prices {
        label
        amount
      }
      reviews {
        message
        user {
          id
          username
        }
      }
      tags {
        id
        name
      }
    }
  }
`;

Capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class TagScreen extends Component {
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

    if (this.props.data.loading) {
      return <View style={{ flex: 1, padding: 20 }}><ActivityIndicator /></View>
    }

    return (
      <FlatList
        data={this.props.data.eventsOfTag}
        renderItem={({item}) => <EventItem event={item} navigation={this.props.navigation}/>}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

const styles = StyleSheet.create({
  
});

export default graphql(tagEventsQuery, {
  options: (props) => ({ variables: { tagId: props.navigation.getParam('tag', 'tag was not passed from FeedScreen').id } })
})( TagScreen );
