import React, { Component } from 'react';
import { Text, View, Button, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, ScrollView, Image, AsyncStorage } from 'react-native';
import FollowButton from './FollowButton';
import Navigator from './Navigator';
import { SimpleLineIcons } from '@expo/vector-icons';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import Moment from 'moment';

const findProfileQuery = gql`
  query ($userId: ID!) {
    findUser(userId: $userId) {
      id
      name
      username
      avatar
      participatingEvents {
        id
        image_name
        title 
        starts_at
        prices {
          amount
        }
        hostedBy {
          id
          username
          avatar
        }
      }
    }
  }
`

class ProfileScreen extends Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.username,
    headerRight: <SimpleLineIcons style={{paddingRight: 12,}} name="options-vertical" size={20} color="#0E334E" />,
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#0E334E',
    headerTitleStyle: {
      fontWeight: 'normal',
    }
  })

  state = {
    user: '',
    isLoading: true,
    history: true,
  }

  loadAvatar = user => {
    const avatar = user.avatar;
    const username = user.username;

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

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading && !nextProps.data.error) {
      
      const hh = this.loadAvatar(nextProps.data.findUser).then((url) => {
        this.setState({
          avatarUrl: url,
          isLoading: false
        });
      });      
    }
  }

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
          <TouchableOpacity onPress={() => {navigation.navigate('Profile', {
            userId: item.hostedBy.id,
            username: item.hostedBy.username
          })}}>
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
          <TouchableOpacity style={styles.profilePic} onPress={() => {navigation.navigate('Profile', {
            userId: item.hostedBy.id,
            username: item.hostedBy.username
          })}}>
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

  goToHistory = () => {
    this.setState(previousState => {
      return { history: true };
    });
  };

  goToPlans = () => {
    this.setState(previousState => {
      return { history: false };
    });
  };


  eventEnding = param => {
    if (param === 1) {
      return 'мероприятие';
    } else if (param < 5 && param > 1) {
      return 'мероприятия';
    } else {
      return 'мероприятий';
    }
  };

  followingsEnding = param => {
    if (param === 1) {
      return 'подписка';
    } else if (param < 5 && param > 1) {
      return 'подписки';
    } else {
      return 'подписок';
    }
  };

  followersEnding = param => {
    if (param === 1) {
      return 'подписчик';
    } else if (param < 5 && param > 1) {
      return 'подписчика';
    } else {
      return 'подписчиков';
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    const user = this.props.data.findUser
    const participatingEvents = user.participatingEvents

    const User_events = (
      <TouchableOpacity>
        <View style={styles.block}>
          <Text style={styles.numbers}>5</Text>
          <Text style={styles.nouns}>
            {this.eventEnding(5 % 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const Followings = (
      <TouchableOpacity>
        <View style={styles.block}>
          <Text style={styles.numbers}>6</Text>
          <Text style={styles.nouns}>
            {this.followingsEnding(6 % 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const Followers = (
      <TouchableOpacity>
        <View style={styles.block}>
          <Text style={styles.numbers}>7</Text>
          <Text style={styles.nouns}>
            {this.followersEnding(7 % 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const Name = (
      <View style={styles.common}>
        <Text style={ styles.name }>{user.name}</Text>
      </View>
    );

    const History = props => {
      return (
        <FlatList
          data={props.participatingEvents}
          renderItem={this.renderEvent}
          keyExtractor={(item, index) => index.toString()}
        />
      )
      
    }

    const Plans = props => {
      console.log(props)
      return <View></View>
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.image}>
          <Image
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
            }}
            resizeMode="contain"
            source={{
              uri: this.state.avatarUrl
            }}
          />
        </View>
        {Name}
        <View style={styles.violetContainer}>
          <View style={styles.infoBlocks}>
            {User_events}
            {Followings}
            {Followers}
          </View>
          <FollowButton />
        </View>

        <Navigator goToHistory={this.goToHistory} goToPlans={this.goToPlans}/>

        <View style={{flex: 1}}>
          {this.state.history ? <History participatingEvents={participatingEvents} /> : <Plans participatingEvents={participatingEvents}/>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    flex: 3,
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '400',
    fontSize: 16,
  },
  common: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 4,
  },
  violetContainer: {
    paddingLeft: 54,
    paddingRight: 54,
    paddingBottom: 12,
  },
  infoBlocks: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    flexDirection: 'row',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    width: 84,
  },
  numbers: {
    fontWeight: 'bold',
    color: '#26A4FF',
  },
  nouns: {
    color: '#86CCFF',
    fontSize: 12,
  },
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
    flex: 14,
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

export default graphql(findProfileQuery, {
  options: (props) => ({ variables: { userId: props.navigation.getParam('userId', 'eventId was not passed to ProfileScreen') } })
})( ProfileScreen );