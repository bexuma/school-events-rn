import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  Button,
  FlatList,
  Image,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { ImagePicker } from 'expo';

import Loader from './Loader';

import { Entypo } from '@expo/vector-icons';

const signUpUserMutation = gql`
  mutation ($name: String!, $username: String!, $email: String!, $password: String!, $avatar: String!){
    createUser(name: $name, username: $username, authProvider: {email: {email: $email, password: $password}}, avatar: $avatar) {
      user {
        id
      }
    }
  }
`;

const signInUserMutation = gql`
  mutation ($email: String!, $password: String!){
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

class SignupScreen extends React.Component {
  static navigationOptions = {
    title: 'Регистрация',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#0E334E',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };

  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    image: '',
    isLoading: false
  };

  uploadAvatarToS3 = async (imageUri, timestamp) => {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAJMHDUCEW2SQHAEJA',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });

    const params = {
      Bucket: 'senbi',
      Key: `images/${this.state.username}/photos/${timestamp}.jpg`,
      ContentType: 'image/jpeg',
    };

    await s3.getSignedUrl('putObject', params, function(err, url) {
      const request = new XMLHttpRequest();
      //request.open('PUT', url);
      request.onreadystatechange = e => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          // console.log('success', request.responseText);
          console.log('Image successfully uploaded to S3');
        } else {
          console.warn('Error while sending the image to S3');
        }

        if (e) {
          console.log(e);
        }
      };

      request.open('PUT', url);
      request.setRequestHeader('Content-Type', 'image/jpeg');
      request.send({
        uri: imageUri,
        type: 'image/jpeg',
        name: `${timestamp}.jpg`,
      });
    });
  }

  handleSignUpButton = async imageUri => {
    this.setState({isLoading: true})

    try {
      const { name, username, email, password } = this.state;
      const timestamp = '' + Date.now();

      await this.props.signUpUserMutation({
        variables: { name, username, email, password, avatar: `${timestamp}` },
      });

      this.uploadAvatarToS3(imageUri, timestamp)

      const result = await this.props.signInUserMutation({
        variables: { email, password },
      });

      await AsyncStorage.setItem(
        'token', result.data.signInUser.token
      );

      let user = result.data.signInUser.user
      user.avatarUrl = await this.loadPreSignedImageUrl(user)

      await AsyncStorage.setItem(
        'user', JSON.stringify(user)
      );

      this.setState({isLoading: false})

      this.props.navigation.navigate('App');

    } catch (e) {
      console.log('EROOR', e);
    }
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

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  render() {
    let { image } = this.state;

    if (this.props.signUpUserMutation.loading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.props.signInUserMutation.loading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-44}
        behavior="position"
        style={styles.container}
        enabled>
          <TouchableOpacity style={styles.imageView} onPress={this.pickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.image} />
            ) : (
              <View
                style={[
                  styles.image,
                  {
                    backgroundColor: '#86CCFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Entypo name="add-user" size={120} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.textInputView}>
            <TextInput
              theme={{ colors: { primary: "#26A4FF" }}}
              label="Полное имя"
              underlineColor="#26A4FF"
              placeholder="Введите имя..."
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />

            <TextInput
              theme={{ colors: { primary: "#26A4FF" }}}
              label="Электронная почта"
              underlineColor="#26A4FF"
              placeholder="Введите адрес электронной почты..."
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />

            <TextInput
              theme={{ colors: { primary: "#26A4FF" }}}
              label="Имя пользователя"
              underlineColor="#26A4FF"
              placeholder="Введите имя пользователя..."
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
            />

            <TextInput
              theme={{ colors: { primary: "#26A4FF" }}}
              label="Пароль"
              underlineColor="#26A4FF"
              placeholder="Введите пароль..."
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>

          <View style={{ alignItems: 'center', paddingTop: 8 }}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => {
                this.handleSignUpButton(image.uri);
              }}>
              <Text style={styles.signUpButtonText}>Создать профиль</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
           style={{ alignItems: 'center', paddingTop: 8}}
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}>
            <Text>
              У вас уже есть аккаунт? Войти
            </Text>
          </TouchableOpacity>

          <Loader
            loading={this.state.isLoading}
            text="register"
             />

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'space-between',
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  textInputView: {
  },
  signUpButton: {
    height: 32,
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#26A4FF',
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default compose(
  graphql(signUpUserMutation, { name: 'signUpUserMutation' }),
  graphql(signInUserMutation, { name: 'signInUserMutation' })
)(SignupScreen);
