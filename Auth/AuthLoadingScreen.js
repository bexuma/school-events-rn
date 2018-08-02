import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

var params = {Bucket: 'senbi', Key: 'images/toleuov/930924329084932409.jpg'};
s3.getSignedUrl('getObject', params, function (err, url) {
    console.log('Your  pre-signed URL is', url);
});

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }


  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}