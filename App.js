import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FeedScreen from './FeedScreen';
import AddEventScreen from './AddEventScreen';
import MyProfileScreen from './MyProfileScreen';
import LoginScreen from './Auth/LoginScreen';
import RegisterScreen from './Auth/RegisterScreen';
import AuthLoadingScreen from './Auth/AuthLoadingScreen';
import EventScreen from './EventScreen';

global.token = ""
const httpLink = new HttpLink({ uri: 'https://senbi.herokuapp.com/graphql' })
const authLink = setContext((_, { headers }) => {
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

const AppStack = createStackNavigator({ Main: TabNavigator, Event: EventScreen });
const AuthStack = createStackNavigator({ Login: LoginScreen, Register: RegisterScreen });

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <SwitchNavigator />
      </ApolloProvider>
    )
  }
}