import React, { Component } from 'react';
import { Text, View, Button, Image, AsyncStorage, StyleSheet, ScrollView, FlatList } from 'react-native';
import Moment from 'moment';
require('moment/locale/ru.js');

export default class EventScreen extends Component {

  state = {
    imageUrl: '' 
  }

  componentDidMount() {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

    var params = {Bucket: 'senbi', Key: 'images/toleuov/1533208689907.jpg'};
    s3.getSignedUrl('getObject', params, (err, url) => {
        // console.log('Your  pre-signed URL is', url);
        this.setState({
          imageUrl: url
        })

    });
  }

  render() {
    const { navigation } = this.props;
    const event = navigation.getParam('event', '')
    Moment.locale('ru');

    return (
      <ScrollView style={styles.container}>
        <Image
          style={{height: 200, marginBottom: 10}}
          source={{uri: this.state.imageUrl}}
        />

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
    padding: 16
  },
  title: {
    fontSize: 20
  },
  item: {
    backgroundColor: 'white',
    padding: 8,
    flex: 1,
    height: 188,
  },
  top: {
    flex: 3,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  body: {
    backgroundColor: 'blue',
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
    backgroundColor: 'yellow',
    flex: 3,
    flexDirection: 'row',
  },
  friends: {
    flex: 3,
    justifyContent: 'center',
  },
  bookmark: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});