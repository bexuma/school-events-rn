import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator,createStackNavigator } from 'react-navigation';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeedScreen from './FeedScreen';
import AddEventScreen from './AddEventScreen';
import MyProfileScreen from './MyProfileScreen';
import LoginScreen from './Entry/LoginScreen';
import RegisterScreen from './Entry/RegisterScreen';

global.token = ""

const httpLink = new HttpLink({ uri: 'https://senbi.herokuapp.com/graphql' })

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  if (global.token !== "") {
    return {
      headers: {
        authorization: "Bearer " + global.token
      }
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

class MainScreen extends React.Component {
  render() {
    return <TabNavigator />;
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Feed: FeedScreen,
    AddEvent: AddEventScreen,
    MyProfile: MyProfileScreen,
  },
  {
    initialRouteName: 'Feed',
    tabBarOptions: {
      activeTintColor: 'purple',
      inactiveTintColor: 'black',
    },
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Feed') {
          iconName = `ios-paper${focused ? '' : '-outline'}`;
        } else if (routeName === 'AddEvent') {
          iconName = `ios-add-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'MyProfile') {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
  }
);

const StackNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    Main: MainScreen,
  },
  { initialRouteName: 'Login' }
);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <StackNavigator />
      </ApolloProvider>
    )
  }
}