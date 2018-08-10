import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Image,
  AsyncStorage,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { SimpleLineIcons } from '@expo/vector-icons';
import Moment from 'moment';

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
      refreshing: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      this.setState({
        isLoading: false,
        user: JSON.parse(user),
      });
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.allEventsQuery.loading && !nextProps.allEventsQuery.error) {
      const { allEvents } = nextProps.allEventsQuery;
      const promiseImageUrls = allEvents.map(event => this.loadImage(event));
      const promiseAvatarUrls = allEvents.map(event => this.loadAvatar(event));

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


  loadAvatar = item => {
    const avatar = item.hostedBy.avatar;
    const username = item.hostedBy.username;

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAJMHDUCEW2SQHAEJA',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });

    const params = {
      Bucket: 'senbi',
      Key: `images/${username}/photos/${avatar}.jpg`,
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
  };

  loadImage = item => {
    const image_name = item.image_name;
    const username = item.hostedBy.username;

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAJMHDUCEW2SQHAEJA',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });

    const params = {
      Bucket: 'senbi',
      Key: `images/${username}/${image_name}.jpg`,
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
  };

  renderPrices = prices => {
    let text;
    if (prices.length === 1) {
      text = `\u20B8${prices[0].amount}`;
    } else if (prices.length > 1) {
      const amounts = prices.map(price => price.amount);
      amounts.sort((a, b) => a - b);
      text = `\u20B8${amounts[0]} - \u20B8${amounts[amounts.length - 1]}`;
    } else {
      text = 'Свободный вход';
    }

    return <Text>{text}</Text>;
  };

  renderEvent = ({ item }) => {
    const { navigation } = this.props;
    const screenWidth = Dimensions.get('window').width;
    
    const Host = (
          <TouchableOpacity onPress={() => {navigation.navigate('Profile')}}>
              <Text style={{ fontWeight: 'bold' }}>
                {item.hostedBy.username}
              </Text>
          </TouchableOpacity>
    );

    const Title = <Text style={{ fontSize: 16 }}>{item.title}</Text>;

    const Datetime = (
      <Text style={{ color: 'grey', fontSize: 14 }}>
        {Moment(item.starts_at).format('Do MMMM, HH:mm')}
      </Text>
    );

    const WhoIsIn = (
      <View style={styles.whoIsIn}>
        <TouchableOpacity>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>
              {item.participantIds.length}
            </Text>
            участников
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>21</Text> друг
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => {
          navigation.navigate('Event', {
            event: item,
            user: this.state.user,
          });
        }}>
        <Image
          style={{
            height: Math.round((screenWidth * 9) / 16),
            width: screenWidth,
          }}
          source={{
            uri: item.imageUrl,
          }}
        />
        <View style={styles.info}>
          <TouchableOpacity style={styles.profilePic} onPress={() => {navigation.navigate('Profile')}}>
            <Image
              style={{ height: screenWidth / 7.5, width: screenWidth / 7.5 }}
              borderRadius={screenWidth / 15}
              source={{
                uri: item.avatarUrl,
              }}
            />
          </TouchableOpacity>
          <View style={styles.text}>
            {Title}
            {Host}
            {Datetime}
            {this.renderPrices(item.prices)}
          </View>
          <TouchableOpacity style={styles.kebab}>
            <SimpleLineIcons name="options-vertical" size={20} color="#26A4FF" />
          </TouchableOpacity>
        </View>
        {/* <View style={{ padding: 16, paddingTop: 0, paddingBottom: 24}}>
          <Text>
            идут <Text style={{ fontWeight: 'bold' }}>assankhanov, zhakulin99</Text> и
            <Text style={{ fontWeight: 'bold' }}> еще 28</Text>
          </Text>
        </View> */}
      </TouchableOpacity>
    );
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.allEventsQuery.refetch().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    if (this.state.isLoading) {
      return <View />;
    }

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
        renderItem={this.renderEvent}
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

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
  },
  info: {
    padding: 16,
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 24,
  },
  profilePic: {
    flex: 3,
  },
  text: {
    flex: 17,
    paddingLeft: 16,
  },
  kebab: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  whoIsIn: {
    flex: 5,
    justifyContent: 'center',
  },
});

export default graphql(allEventsQuery, { name: 'allEventsQuery' })(FeedScreen);
