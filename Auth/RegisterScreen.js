import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Button, FlatList, Image, Text, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';
import { ImagePicker } from 'expo';

const signUpUserMutation = gql`
  mutation ($name: String!, $username: String!, $email: String!, $password: String!, $avatar: String!){
    createUser(name: $name, username: $username, authProvider: {email: {email: $email, password: $password}}, avatar: $avatar) {
      user {
        id
      }
    }
  }
`

const signInUserMutation = gql`
  mutation ($email: String!, $password: String!){
    signInUser(email: {email: $email, password: $password}) {
      token
      user {
        id
      }
    }
  }
`

class SignupScreen extends React.Component {
  static navigationOptions = {
    title: 'Sign up',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#009688',
    },

    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    image: ''
  }

  handleSignUpButton = async (imageUri) => {
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3({accessKeyId:'AKIAJMHDUCEW2SQHAEJA', secretAccessKey:'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', region:'ap-south-1'})

    const timestamp = '' + Date.now()
    const params = {Bucket: 'senbi', Key: `images/${this.state.username}/photos/${timestamp}.jpg`, ContentType: 'image/jpeg'}
    
    s3.getSignedUrl('putObject', params, function (err, url) {
      const request = new XMLHttpRequest()
      //request.open('PUT', url);
      request.onreadystatechange = (e) => {  
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
          console.log(e)
        }
      }

      request.open('PUT', url)
      request.setRequestHeader('Content-Type', 'image/jpeg')
      request.send({ uri: imageUri, type: 'image/jpeg', name: `${timestamp}.jpg` })

    })

    try {
      const {name, username, email, password} = this.state

      await this.props.signUpUserMutation({
       variables: {name, username, email, password, avatar: `${timestamp}`}
      })

      const result = await this.props.signInUserMutation({
       variables: {email, password}
      })

      this.props.navigation.navigate('Main', {
        user: result.data.signInUser.user
      }) 
    } catch(e) {
      console.log('EROOR', e)
    }
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

  render () {
    let { image } = this.state;

    if (this.props.signUpUserMutation.loading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    if (this.props.signInUserMutation.loading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          {image
            ? (<Image source={{ uri: image.uri }} style={{ height: 150, width: 150, borderRadius: 150/2, marginTop: 10 }} />)
            : (<View style={{ height: 150, width: 150, borderRadius: 150/2, marginTop: 10, backgroundColor: 'gray' }} />) }
        </View>
        
        <TouchableOpacity
          style={[styles.button, styles.addImagebutton]}
          onPress={this.pickImage}
        >
          <Text style={styles.buttonText}>
            Choose an image
          </Text>
        </TouchableOpacity>

        <TextInput
          label='Name'
          underlineColor="#159688"
          placeholder='Type your name...'
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />

        <TextInput
          label='Email'
          underlineColor="#159688"
          placeholder='Type your email...'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          label='Имя пользователя'
          underlineColor="#159688"
          placeholder='Введите имя пользователя...'
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />

        <TextInput
          label='Пароль'
          underlineColor="#159688"
          placeholder='Type your password...'
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {
            this.handleSignUpButton(image.uri)
          }}
          
        >
          <Text style={styles.signUpButtonText}>
            Создать профиль
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 8}}
          onPress={() => {
            this.props.navigation.navigate('Login')
          }}
        >
          <Text style={{textAlign: 'center'}}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  },
  signUpButton: {
    alignItems: 'center',
    backgroundColor: '#009688',
    padding: 10,
    marginTop: 10
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: 'bold'
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  },
  addImagebutton: {
    alignItems: 'center',
    backgroundColor: '#26A69A',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#009688',
  },

  
})

export default compose(graphql(signUpUserMutation, {name: 'signUpUserMutation'}), graphql(signInUserMutation, {name: 'signInUserMutation'}))(SignupScreen)




