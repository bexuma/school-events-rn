import React, { Component } from 'react';
import { Text, View, Button, Image, AsyncStorage, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import ActionButton from './components/ActionButton';
import { Feather } from '@expo/vector-icons';
import Moment from 'moment';
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
require('moment/locale/ru.js');
// Moment.locale('ru');

export default class EventScreen extends Component {
  state = {
    imageUrl: '',
    isLoading: true
  }

  componentDidMount() {
    this.setState({
      numberOfParticipants: this.props.navigation.getParam('event', 'event is not found in props').participantIds.length
    })
  }

  updateNumberOfParticipants = (numberOfParticipants) => {
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
    const event = this.props.navigation.getParam('event', 'event is not found in props')

      return (
        <ScrollView style={styles.container}>
          <Image
            style={{height: 200, marginBottom: 10}}
            source={{uri: event.imageUrl}}
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
