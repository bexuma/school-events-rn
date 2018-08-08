import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet, AsyncStorage } from 'react-native'
import { TextInput } from 'react-native-paper';

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
`

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#26A4FF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
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

      await AsyncStorage.setItem('token', result.data.signInUser.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.data.signInUser.user));

      this.props.navigation.navigate('Main')
    }
    catch(e) {
      console.log(e)
      alert("Email or password does not match")
    }

  }

  render () {
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
          label='E-mail'
          underlineColor="#26A4FF"
          selectionColor="#26A4FF"
          placeholder='Type your email...'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          autoCapitalize="none"
        />

        <TextInput
          label='Password'
          underlineColor="#26A4FF"
          selectionColor="#26A4FF"
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
    backgroundColor: '#26A4FF',
    padding: 10,
    marginTop: 10
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: 'bold'
  }
})

export default graphql(signInUserMutation, {name: 'signInUserMutation'})(LoginScreen)