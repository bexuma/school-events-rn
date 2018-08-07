import React, { Component } from 'react';
import { Text, View, Button, Image, AsyncStorage, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import ActionButton from './components/ActionButton';
import { Feather } from '@expo/vector-icons';
import Moment from 'moment';
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
require('moment/locale/ru.js');
// Moment.locale('ru');

const eventQuery = gql`
  query ($eventId: ID!) {
    event(eventId: $eventId) {
      id
      title
      description
      image_name
      participantIds
      hostedBy {
        username
      }
    }
  }
`

class EventScreen extends Component {
  state = {
    imageUrl: '',
    isLoading: true
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && !nextProps.error) {
      this.setState({
        event: JSON.stringify(nextProps.data.event),
        isLoading: false,
        numberOfParticipants: nextProps.data.event.participantIds.length
      })
    }
  }

  // componentDidMount = async () => {
  //   try {
  //     console.log(this.props)
  //     console.log(this.props.navigation.getParam('eventId', 'eventId is not found in props'))

  //     // const eventId = navigation.getParam('event', 'image_name is not found in props').id
  //     // const result = await this.props.eventQuery({
  //     //  variables: {eventId}
  //     // })

  //     // this.setState({
  //     //   event: JSON.stringify(result.data.event)
  //     // })

  //     // const { navigation } = this.props;
  //     // const user = navigation.getParam('user', 'user is not found in props')
  //     // const image_name = result.data.event.image_name
  //     // const username = result.data.event.hostedBy.username

  //     // const AWS = require('aws-sdk');
  //     // const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

  //     // var params = {Bucket: 'senbi', Key: `images/${username}/${image_name}.jpg`};
  //     // await s3.getSignedUrl('getObject', params, (err, url) => {
  //     //     console.log('Your pre-signed URL is:', url);
  //     //     this.setState({
  //     //       imageUrl: url,
  //     //       numberOfParticipants: result.data.event.participantIds.length,
  //     //       isLoading: false
  //     //     })
  //     // });
  //   }
  //   catch(e) {
  //     console.log(e)
  //   }
  // }

  updateNumberOfParticipants = (numberOfParticipants) => {
    // console.log(numberOfParticipants)
    this.setState({ numberOfParticipants })
  }

  formatNumberOfParticipants = (numberOfParticipants) => {
    if (numberOfParticipants % 10 === 1) {
      return 'участник';
    } else if (numberOfParticipants % 10 < 5 && numberOfParticipants % 10 > 1) {
      return 'участника';
    } else {
      return 'участников';
    }
  }

  WhoIsIn = (numberOfParticipants) => {
    return (
      <View style={styles.iconInfo}>
        <View style={styles.icon}>
          <Feather name="users" size={24} color="#7E2FFF" />
        </View>
        <View style={styles.text}>
          <TouchableOpacity>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{numberOfParticipants}</Text> {this.formatNumberOfParticipants(numberOfParticipants)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>21</Text> друг
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {

    if (!this.state.event) {
      return <ActivityIndicator size="large" color="#0000ff" />
    } else {
      const event = JSON.parse(this.state.event)

      return (
        <ScrollView style={styles.container}>
          <Image
            style={{height: 200, marginBottom: 10}}
            source={{uri: this.state.imageUrl}}
          />

          <View style={styles.common}>
            <ActionButton eventId={event.id} participantIds={event.participantIds} updateNumberOfParticipants={this.updateNumberOfParticipants} />
          </View>

          {this.WhoIsIn(this.state.numberOfParticipants)}

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
      )
    }
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

export default graphql(eventQuery, {
  options: (props) => ({ variables: { eventId: props.navigation.getParam('eventId', 'eventId was not passed from FeedScreen') } })
})( EventScreen );

// export default graphql(eventQuery)( EventScreen );