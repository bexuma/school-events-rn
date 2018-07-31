import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { View, TouchableOpacity, Text, StyleSheet, AsyncStorage } from 'react-native'
import { TextInput } from 'react-native-paper';

const signInUserMutation = gql`
  mutation ($email: String!, $password: String!) {
    signInUser(email: {email: $email, password: $password}) {
      token
      user {
        id
      }
    }
  }
`

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
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
    email: '',
    password: ''
  }

  handleSignInButton = async () => {
    try {
      const {email, password} = this.state
      const result = await this.props.signInUserMutation({
       variables: {email, password}
      })

      await AsyncStorage.setItem('userToken', result.data.signInUser.token);

      this.props.navigation.navigate('Main', {
        user: result.data.signInUser.user
      })
    }
    catch(e) {
      alert("Email or password does not match")
    }

  }

  render () {

    return (
      <View style={styles.container}>
        <TextInput
          label='E-mail'
          underlineColor="#159688"
          placeholder='Type your email...'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          label='Password'
          underlineColor="#159688"
          secureTextEntry={true}
          placeholder='Type your password...'
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            this.handleSignInButton()
          }}
          
        >
          <Text style={styles.signInButtonText}>
            Войти
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 8}}
          onPress={() => {
            this.props.navigation.navigate('Register')
          }}
        >
          <Text style={{textAlign: 'center'}}>
            Do not have an account? Sign Up
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
  signInButton: {
    alignItems: 'center',
    backgroundColor: '#009688',
    padding: 10,
    marginTop: 10
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: 'bold'
  }
})

export default graphql(signInUserMutation, {name: 'signInUserMutation'})(LoginScreen)