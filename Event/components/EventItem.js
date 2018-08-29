import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import TextHelper from '../../utils/textHelper';

class EventItem extends Component {

  render() {
    const { navigation, event } = this.props
    const screenWidth = Dimensions.get('window').width;

    const Host = (
      <TouchableOpacity onPress={() => {navigation.navigate('Profile', {
        userId: event.hostedBy.id,
        username: event.hostedBy.username
      })}}>
        <Text style={{ fontWeight: 'bold' }}>
          {event.hostedBy.username}
        </Text>
      </TouchableOpacity>
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => {
          navigation.navigate('Event', {
            event: event,
            user: this.props.user,
          });
        }}>
        <Image
          style={{
            height: Math.round((screenWidth * 9) / 16),
            width: screenWidth,
          }}
          source={{
            uri: event.imageUrl,
          }}
        />
        <View style={styles.info}>
          <TouchableOpacity style={styles.profilePic} onPress={() => {navigation.navigate('Profile', {
            userId: event.hostedBy.id,
            username: event.hostedBy.username
          })}}>
            <Image
              style={{ height: screenWidth / 7.5, width: screenWidth / 7.5 }}
              borderRadius={screenWidth / 15}
              source={{
                uri: event.avatarUrl,
              }}
            />
          </TouchableOpacity>
          <View style={styles.text}>

            <Text style={styles.title}>
              {event.title}
            </Text>

            {Host}

            <Text style={styles.startsAt}>
              {TextHelper.getFormattedStartDate(event.starts_at)}
            </Text>

            <Text>
              {TextHelper.getFormattedPrice(event.prices)}
            </Text>

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

        <FlatList
          data={event.tags}
          renderItem={({item}) => <TouchableOpacity onPress={() => {navigation.navigate('Tag', {
            tag: item
          })}}><Text>{item.name}</Text></TouchableOpacity>}
          keyExtractor={(item, index) => index.toString()}
        />
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
  },
  startsAt: {
    color: 'grey',
    fontSize: 14
  },
  title: {
    fontSize: 16
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
  }
});

export default EventItem;