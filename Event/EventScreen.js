import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Dimensions,
  Image,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import ActionButton from './components/ActionButton';
import Moment from 'moment';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
require('moment/locale/ru.js');
import {
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
// Moment.locale('ru');

const createReviewMutation = gql`
  mutation(
    $message: String!
    $eventId: ID!
  ) {
    createReview(
      message: $message,
      eventId: $eventId
    ) {
      id
      message
    }
  }
`;

class EventScreen extends Component {
  state = {
    imageUrl: '',
    isLoading: true,
    message: ''
  };

  componentDidMount() {
    this.setState({
      numberOfParticipants: this.props.navigation.getParam(
        'event',
        'event is not found in props'
      ).participantIds.length,
    });
  }

  updateNumberOfParticipants = numberOfParticipants => {
    this.setState({ numberOfParticipants });
  };

  formatNumberOfParticipants = numberOfParticipants => {
    if (numberOfParticipants % 10 === 1) {
      return 'участник';
    } else if (numberOfParticipants % 10 < 5 && numberOfParticipants % 10 > 1) {
      return 'участника';
    } else {
      return 'участников';
    }
  };

  WhoIsIn = numberOfParticipants => {
    return (
      <View style={styles.iconInfo}>
        <View style={styles.icon}>
          <Feather name="users" size={24} color="#7E2FFF" />
        </View>
        <View style={styles.text}>
          <TouchableOpacity>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{numberOfParticipants}</Text>{' '}
              {this.formatNumberOfParticipants(numberOfParticipants)}
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
  };

  handleAddReviewForm = async (eventId) => {
    try {
      const { message } = this.state;

      const result = await this.props.createReviewMutation({
        variables: {
          message,
          eventId
        }
      })

      this.setState({
        message: ''
      })

      console.log(result)

    } catch (err) {
      console.log('err', err);
    }
  }

  render() {
    const event = this.props.navigation.getParam(
      'event',
      'event is not found in props'
    );

    const Description = (
      <View style={styles.description}>
        <Text style={{ color: 'grey' }}>{event.description}</Text>
      </View>
    );

    const Datetime = (
      <View style={styles.iconInfo}>
        <View style={styles.icon}>
          <Ionicons name="md-calendar" size={24} color="#7E2FFF" />
        </View>
        <View style={styles.text}>
          <Text>
            {Moment(event.starts_at).format('Do MMMM YYYY года в HH:mm')}
          </Text>
        </View>
      </View>
    );

    const Address = (
      <View style={styles.iconInfo}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color="#7E2FFF"
          />
        </View>
        <View style={styles.text}>
          <Text>{event.address}</Text>
        </View>
      </View>
    );

    const Prices = (
      <View style={styles.iconInfo}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="cash-multiple"
            size={24}
            color="#7E2FFF"
          />
        </View>
        <View style={styles.text}>
          {!Array.isArray(event.prices) || !event.prices.length ? (
            <Text>Свободный вход</Text>
          ) : (
            <FlatList
              data={event.prices}
              renderItem={({ item }) => (
                <Text>
                  {item.label ? `${item.label}: ` : ''}
                  {item.amount} тенге
                </Text>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    );

    

    return (
      <ScrollView style={styles.container}>
        <View style={styles.image}>
          <Image
            style={{
              height: 200,
            }}
            resizeMode="contain"
            source={{
              uri: event.imageUrl,
            }}
          />
        </View>
        <View style={styles.common}>
          <Text style={{ fontWeight: '400', fontSize: 16 }}>{event.title}</Text>
        </View>
        <View style={styles.common}>
          <ActionButton
            eventId={event.id}
            participantIds={event.participantIds}
            updateNumberOfParticipants={this.updateNumberOfParticipants}
          />
        </View>
        {this.WhoIsIn(this.state.numberOfParticipants)}
        {Description}
        {Datetime}
        {Address}
        {Prices}

        <Text>Отзывы</Text>

        <View style={styles.text}>
          {!Array.isArray(event.reviews) || !event.reviews.length ? (
            <Text>Отзывы отсутствуют. Напишите о мероприятии.</Text>
          ) : (
            <FlatList
              data={event.reviews}
              renderItem={({ item }) => (
                <Text>
                  {item.message} by {item.user.name}
                </Text>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        <TextInput
          theme={{ colors: { primary: '#26A4FF' } }}
          underlineColor="#26A4FF"
          label="Отзыв"
          multiline={true}
          placeholder="Добавьте отзыв..."
          onChangeText={message => this.setState({ message })}
          value={this.state.message}
        />

        <Button
          title="Send"
          onPress={() => this.handleAddReviewForm(event.id)}
        />

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
    width: Dimensions.get('window').width,
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

export default graphql(createReviewMutation, { name: 'createReviewMutation' })(
  EventScreen
);
