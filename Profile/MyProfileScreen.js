import React, { Component } from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet, ScrollView, Image, AsyncStorage } from 'react-native';
import HeaderRight from './HeaderRight';
import FollowButton from './FollowButton';
import Navigator from './Navigator';


export default class MyProfileScreen extends Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: 'bexuma',
    headerRight: <HeaderRight navigation={navigation}/>,
    headerStyle: {
      backgroundColor: '#26A4FF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    }
  });


  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')

  };

  state = {
    user: '',
    isLoading: true,
    history: true,
  }

  changeScreen = () => {
    this.setState(previousState => {
      return { history: !previousState.history };
    });
  };

  componentDidMount = async () => {
    await AsyncStorage.getItem('user').then((user) => {
      // console.log(user)
      this.setState({
        user: JSON.parse(user)
      });

    });

    const avatar = this.state.user.avatar
    const username = this.state.user.username

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

    var params = {Bucket: 'senbi', Key: `images/${username}/photos/${avatar}.jpg`};
    await s3.getSignedUrl('getObject', params, (err, url) => {
        console.log('Your pre-signed avatar URL is:', url);
        this.setState({
          imageUrl: url,
          isLoading: false
        })
    });

  }

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
      return <View></View>
    }

    const user = {
      username: 'bexuma',
      name: 'Бексултан Мырзатаев',
      pic_url:
        'https://instagram.fhel5-1.fna.fbcdn.net/vp/ffded36165db7720ce1e0f45def170d9/5C04FE2A/t51.2885-19/s320x320/33858515_2085790094782925_5169251405709443072_n.jpg',
      user_events: ['Благотворительный Музыкальный Забег', 'yo'],
      followers: ['lyailyam', 'assankhanov', 'abilkassov'],
      followings: ['lyailyam', 'assankhanov'],
    };

    const User_events = (
      <TouchableOpacity>
        <View style={styles.block}>
          <Text style={styles.numbers}>{user.user_events.length}</Text>
          <Text style={styles.nouns}>
            {this.eventEnding(user.user_events.length % 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const Followings = (
      <TouchableOpacity>
        <View style={styles.block}>
          <Text style={styles.numbers}>{user.followings.length}</Text>
          <Text style={styles.nouns}>
            {this.followingsEnding(user.followings.length % 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const Followers = (
      <TouchableOpacity>
        <View style={styles.block}>
          <Text style={styles.numbers}>{user.followers.length}</Text>
          <Text style={styles.nouns}>
            {this.followersEnding(user.followers.length % 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );

    const Name = (
      <View style={styles.common}>
        <Text style={ styles.name }>{this.state.name}</Text>
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
              uri: this.state.imageUrl,
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
          <Navigator changeScreen={this.changeScreen}/>
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
