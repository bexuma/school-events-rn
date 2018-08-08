import React, { Component } from 'react';
import { View, ActivityIndicator, RefreshControl, Image, AsyncStorage, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import {
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
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
        username
        avatar
      }
      site_url
      starts_at
      ends_at

    }
  }
`

      // prices {
      //   label
      //   amount
      // }

class FeedScreen extends Component {
  static navigationOptions = {
    title: 'Мероприятия',
    headerStyle: {
      backgroundColor: '#159688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      events: [],
      refreshing: false,
      isLoading: true
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then((user) => {
      this.setState({
        isLoading: false,
        user: JSON.parse(user)
      });
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.allEventsQuery.loading && !nextProps.allEventsQuery.error) {

      const { allEvents } = nextProps.allEventsQuery;
      const imageUrls = allEvents.map(event => this.loadImage(event));
      

      const result = await Promise.all(imageUrls)
      const newEvents = allEvents.map((event, index) => ({ ...event, imageUrl: result[index]}))
       
      this.setState({
        events: newEvents
      })
    }
  }

  loadImage = async (item) => {
    const image_name = item.image_name
    const username = item.hostedBy.username

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

    const params = {Bucket: 'senbi', Key: `images/${username}/${image_name}.jpg`};
    
    return new Promise ((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      })
    }) 

  }

  renderEvent = ({ item }) => {
    const { navigation } = this.props;

    const Top = (
      <View style={styles.top}>
        <View style={styles.host}>
          <View style={styles.justifyCenter}>
            <Image
              style={{ height: 32, width: 32 }}
              source={{
                uri:
                  'https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/122010/untitled-1_275.png?itok=cpzEBOKS',
              }}
            />
          </View>
          <TouchableOpacity>
            <View style={styles.hostName}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.hostedBy.username}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity>
            <View>
              <Octicons name="kebab-vertical" size={24} color="#7E2FFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );

    const Title = <Text style={{ fontSize: 16 }}>{item.title}</Text>;

    const Datetime = (
      <Text style={{ color: 'grey', fontSize: 14 }}>
        {Moment(item.starts_at).format('Do MMMM YYYY HH:mm')}
      </Text>
    );

    const Tags = (
      <View style={styles.tags}>
        <TouchableOpacity>
          <Text style={{ color: '#26A4FF' }}>
            #Марафон #Благотворительность #Спорт #Бег
          </Text>
        </TouchableOpacity>
      </View>
    );

    const WhoIsIn = (
      <View style={styles.whoIsIn}>
        <TouchableOpacity>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>{item.participantIds.length}</Text> участников
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
        onPress={() => {
          navigation.navigate('Event', {
            event: item,
            user: this.state.user
          })
        }}>
        <View style={styles.item}>
          {Top}
          <View style={styles.body}>
            <View style={styles.text}>
              <View style={{ flex: 1 }}>{Title}</View>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                {Datetime}
                {!Array.isArray(item.prices_attributes) ||
                !item.prices_attributes.length ? (
                  <Text>Свободный вход</Text>
                ) : (
                  <Text>500-5000 тенге</Text>
                  // <FlatList
                  //   data={item.prices_attributes}
                  //   renderItem={({ item }) => (
                  //     <Text style={{ fontSize: 12 }}>
                  //       {item.label}: {item.amount} тенге
                  //     </Text>
                  //   )}
                  // />
                )}
              </View>
            </View>
            <View style={styles.image}>
              <Image
                style={{ height: 107.5, width: 107.5 }}
                source={{
                  uri: item.imageUrl,
                }}
              />
            </View>
          </View>
          <View style={styles.bottom}>
            {Tags}
            {WhoIsIn}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.allEventsQuery.refetch().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    if (this.state.isLoading) {
      return <View></View>
    }

    if (this.props.allEventsQuery.loading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    height: 211.5,
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
  },
  top: {
    paddingLeft: 8,
    flex: 4,
    justifyContent: 'center',
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  host: {
    flex: 11,
    alignItems: 'center',
    flexDirection: 'row',
  },
  hostName: {
    padding: 8,
    justifyContent: 'center',
  },
  justifyCenter: { justifyContent: 'center' },
  actions: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  body: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    flex: 10,
    flexDirection: 'row',
  },
  text: {
    flex: 11,
    justifyContent: 'space-between',
  },
  image: {
    flex: 5,
  },
  bottom: {
    paddingLeft: 8,
    paddingRight: 8,
    flex: 4,
    flexDirection: 'row',
  },
  tags: {
    flex: 11,
    justifyContent: 'center',
    paddingRight: 8,
  },
  whoIsIn: {
    flex: 5,
    justifyContent: 'center',
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff'
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 15
//   },
//   recipe: {
//     flex: 1,
//     flexDirection: 'row',
//     height: 80,
//     alignItems: 'center',
//     paddingLeft: 20,
//     paddingRight: 20,
//     borderBottomColor: '#f4f4f4',
//     borderBottomWidth: 1,
//   },
//   createPostButtonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   createPostButton: {
//     backgroundColor: 'rgba(39,174,96,1)',
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 22,
//     height: 60,
//     width: 480,
//     paddingTop: 18,
//   }
// })

export default graphql(allEventsQuery, {name: 'allEventsQuery'})(FeedScreen)
