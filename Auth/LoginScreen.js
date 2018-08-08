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
} from 'react-native';
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
`;

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
    },
  };

  state = {
    email: '',
    password: '',
  };

  handleSignInButton = async () => {
    try {
      const { email, password } = this.state;
      const result = await this.props.signInUserMutation({
        variables: { email, password },
      });

      console.log("1", result.data.signInUser.token);

      await AsyncStorage.setItem('token', result.data.signInUser.token);
      console.log("2", result.data.signInUser.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.data.signInUser.user));
      console.log("3", result.data.signInUser.user);

      this.props.navigation.navigate('App');
    } catch (e) {
      console.log(e);
      alert('Email or password does not match');
    }
  };

  render() {
    if (this.props.signInUserMutation.loading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

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

        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              this.handleSignInButton();
            }}>
            <Text style={styles.signInButtonText}>Войти</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ alignItems: 'center', paddingTop: 8 }}
          onPress={() => {
            this.props.navigation.navigate('Register');
          }}>
          <Text>Do not have an account? Sign Up</Text>
        </TouchableOpacity>
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
});

export default graphql(signInUserMutation, { name: 'signInUserMutation' })(
  LoginScreen
);
