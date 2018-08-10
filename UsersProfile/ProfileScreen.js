import React, { Component } from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet, ScrollView, Image, AsyncStorage } from 'react-native';
import FollowButton from './FollowButton';
import Navigator from './Navigator';
import {
  SimpleLineIcons
} from '@expo/vector-icons';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

const findProfileQuery = gql`
  query ($userId: ID!) {
    findUser(userId: $userId) {
      id
      name
      username
      participatingEvents {
        title
      }
    }
  }
`

class ProfileScreen extends Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.username,
    headerRight: <SimpleLineIcons style={{paddingRight: 12,}} name="options-vertical" size={20} color="#fff" />,
    headerStyle: {
      backgroundColor: '#26A4FF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    }
  })


  state = {
    user: '',
    isLoading: true,
    history: true,
  }

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
    if (this.props.data.loading) {
      return <View></View>
    }

    const user = this.props.data.findUser

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
              uri: "https://instagram.fala3-1.fna.fbcdn.net/vp/845318ab3eda9697f11c0758eda892e6/5C0A9DDB/t51.2885-19/s320x320/13285489_548929271960880_2016198285_a.jpg",
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
          <Text>
          {this.state.history ? 'History' : 'Plans'}
          </Text>
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
});

export default graphql(findProfileQuery, {
  options: (props) => ({ variables: { userId: props.navigation.getParam('userId', 'eventId was not passed to ProfileScreen') } })
})( ProfileScreen );