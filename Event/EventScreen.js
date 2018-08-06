import React, { Component } from 'react';
import { Text, View, Button, Image, AsyncStorage, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import ActionButton from './components/ActionButton';
import { Feather } from '@expo/vector-icons';
import Moment from 'moment';
require('moment/locale/ru.js');
// Moment.locale('ru');


export default class EventScreen extends Component {
  state = {
    imageUrl: '',
    numberOfParticipants: 0,
    isLoading: true
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user', 'user is not found in props')
    const image_name = navigation.getParam('event', 'image_name is not found in props').image_name
    const username = user.username

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

    var params = {Bucket: 'senbi', Key: `images/${username}/${image_name}.jpg`};
    await s3.getSignedUrl('getObject', params, (err, url) => {
        // console.log('Your pre-signed URL is:', url);
        this.setState({
          imageUrl: url,
          numberOfParticipants: this.props.navigation.getParam('event', '').participantIds.length,
          isLoading: false
        })
    });
  }

  updateParticipantsNumber = (numberOfParticipants) => {
    this.setState({ numberOfParticipants })
  }

  render() {
    const { navigation } = this.props;
    const event = navigation.getParam('event', '')
    const participantIds = navigation.getParam('event', '').participantIds

    const WhoIsIn = (
      <View style={styles.iconInfo}>
        <View style={styles.icon}>
          <Feather name="users" size={24} color="#7E2FFF" />
        </View>
        <View style={styles.text}>
          <TouchableOpacity>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{this.state.numberOfParticipants}</Text> участников
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>21</Text> друг
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    if (this.state.isLoading) {
      return <View></View>
    }

    return (
      <ScrollView style={styles.container}>
        <Image
          style={{height: 200, marginBottom: 10}}
          source={{uri: this.state.imageUrl}}
        />

        <View style={styles.common}>
          <ActionButton eventId={event.id} participantIds={participantIds} updateParticipantsNumber={this.updateParticipantsNumber} />
        </View>

        {WhoIsIn}

        <Text style={styles.title}>
          {event.title}
        </Text>

        <Text>
          {event.description}
        </Text>

        <Text>
          {event.site_url}
        </Text>

        <Text>
          {Moment(event.starts_at).format('d MMM')}
        </Text>

        <FlatList
          data={event.prices}
          renderItem={
            ({item}) => <Text>{item.label} {item.amount}</Text>
          }
        />
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20
  },
  image: {
    flex: 3,
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
  },
  common: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  description: {
    flex: 1,
    padding: 12,
  },
  iconInfo: {
    flex: 1,
    paddingBottom: 4,
    paddingTop: 4,
    flexDirection: 'row',
  },
  icon: {
    flex: 2,
    alignItems: 'center',
  },
  text: {
    flex: 13,
    paddingRight: 16,
  },

});