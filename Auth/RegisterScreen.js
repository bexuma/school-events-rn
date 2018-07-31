import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Button, FlatList, Image, Text, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';

const signUpUserMutation = gql`
  mutation ($name: String!, $username: String!, $email: String!, $password: String!){
    createUser(name: $name, username: $username, authProvider: {email: {email: $email, password: $password}}) {
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
    password: ''
  }

  handleSignUpButton = async () => {
    try {
      const {name, username, email, password} = this.state
      await this.props.signUpUserMutation({
       variables: {name, username, email, password}
      })

      const result = await this.props.signInUserMutation({
       variables: {email, password}
      })

      global.token = result.data.signInUser.token

      this.props.navigation.navigate('Main', {
        user: result.data.signInUser.user
      })
    }
    catch(e) {
      console.log('EROOR', e)
    }
  }

  render () {
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
            this.handleSignUpButton()
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
  }

  
})

export default compose(graphql(signUpUserMutation, {name: 'signUpUserMutation'}), graphql(signInUserMutation, {name: 'signInUserMutation'}))(SignupScreen)




