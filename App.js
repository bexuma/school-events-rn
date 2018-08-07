import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FeedScreen from './FeedScreen';
import CreateEventScreen from './CreateEventScreen';
import MyProfileScreen from './Profile/MyProfileScreen';
import LoginScreen from './Auth/LoginScreen';
import RegisterScreen from './Auth/RegisterScreen';
import AuthLoadingScreen from './Auth/AuthLoadingScreen';
import EventScreen from './Event/EventScreen';

// Lyailya is here

const httpLink = new HttpLink({ uri: 'https://senbi.herokuapp.com/graphql' })
const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      // We have data!!
      // console.log(token);
      return {
        headers: {
          authorization: "Bearer " + token
        }
      }
    } else {
      console.log("No authorization header..")
    }
   } catch (token) {
     // Error retrieving data
   }

    // return {
    //   headers: {
    //     authorization: token ? `Bearer ${token}` : ''
    //   }
    // }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const TabNavigator = createBottomTabNavigator(
  {
    Feed: FeedScreen,
    AddEvent: CreateEventScreen,
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