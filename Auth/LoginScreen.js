import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  Modal,
  TouchableHighlight,
  Alert
} from 'react-native';
import { TextInput } from 'react-native-paper';

import Loader from './Loader';

const signInUserMutation = gql`
  mutation ($email: String!, $password: String!) {
    signInUser(email: {email: $email, password: $password}) {
      token
      user {
        id
        name
        email
        username
        avatar
      }
    }
  }
`;

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Вход',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#26A4FF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };

  state = {
    email: '',
    password: '',
    isLoading: false
  };

  loadPreSignedImageUrl = async (user) => {

    const username = user.username
    const avatar = user.avatar

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'});

    const params = {Bucket: 'senbi', Key: `images/${username}/photos/${avatar}.jpg`};
    
    return new Promise ((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      })
    })
  }

  handleSignInButton = async () => {
    this.setState({isLoading: true})
    try {
      const { email, password } = this.state;
      const result = await this.props.signInUserMutation({
        variables: { email, password }
      });

      await AsyncStorage.setItem('token', result.data.signInUser.token);

      let user = result.data.signInUser.user
      user.avatarUrl = await this.loadPreSignedImageUrl(user)

      await AsyncStorage.setItem('user', JSON.stringify(user));

      this.setState({isLoading: false})

      this.props.navigation.navigate('App');
      
    } catch (e) {
      this.setState({isLoading: false})
      console.log(e);
      alert('Email or password does not match');
    }
  };

  render() {

    return (
      <View style={styles.container}>

        <TextInput
          theme={{ colors: { primary: '#26A4FF' } }}
          label="Электронная почта"
          underlineColor="#26A4FF"
          placeholder="Введите адрес электронной почты.."
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          autoCapitalize="none"
        />

        <TextInput
          theme={{ colors: { primary: '#26A4FF' } }}
          label="Пароль"
          underlineColor="#26A4FF"
          secureTextEntry={true}
          placeholder="Введите пароль..."
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <View style={styles.centerAndPadding}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              this.handleSignInButton();
            }}>
            <Text style={styles.signInButtonText}>Войти</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.centerAndPadding}
          onPress={() => {
            this.props.navigation.navigate('Register');
          }}>
          <Text>Вы еще не регистрировались? Создать профиль</Text>
        </TouchableOpacity>
        <Loader
          loading={this.state.isLoading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
  },
  signInButton: {
    height: 32,
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#26A4FF',
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centerAndPadding: {
    alignItems: 'center', paddingTop: 8, 
  }
});

export default graphql(signInUserMutation, { name: 'signInUserMutation' })(
  LoginScreen
);
