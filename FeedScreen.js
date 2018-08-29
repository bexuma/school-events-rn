import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  AsyncStorage
} from 'react-native';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import EventItem from './Event/components/EventItem'
import SignedUrlHelper from './utils/signedUrlHelper';

const allEventsQuery = gql`
  query {
    allEvents {
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

class FeedScreen extends Component {
  static navigationOptions = {
    title: 'Apta',
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#0E334E',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      refreshing: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      this.setState({
        user: JSON.parse(user),
      });
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.allEventsQuery.loading && !nextProps.allEventsQuery.error) {
      const { allEvents } = nextProps.allEventsQuery;
      const promiseImageUrls = allEvents.map(event => SignedUrlHelper.getPhotoSignedURL(event));
      const promiseAvatarUrls = allEvents.map(event => SignedUrlHelper.getAvatarSignedURL(event));

      const imageUrls = await Promise.all(promiseImageUrls);
      const avatarUrls = await Promise.all(promiseAvatarUrls);

      const newEvents = allEvents.map((event, index) => ({
        ...event,
        imageUrl: imageUrls[index],
        avatarUrl: avatarUrls[index],
      }));

      this.setState({
        events: newEvents,
      });
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.allEventsQuery.refetch().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    if (this.props.allEventsQuery.loading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <FlatList
        data={this.state.events}
        renderItem={({item}) => <EventItem event={item} navigation={this.props.navigation} user={this.state.user}/>}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default graphql(allEventsQuery, { name: 'allEventsQuery' })(FeedScreen);
