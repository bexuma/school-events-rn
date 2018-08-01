import React, { Component } from 'react';
import { View, ActivityIndicator, RefreshControl, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'

const allEventsQuery = gql`
  query {
    allEvents {
      id
      title
      description
    }
  }
`
// site_url
// starts_at
// ends_at
// prices {
//   label
//   amount
// }

class FeedScreen extends Component {
  static navigationOptions = {
    title: 'Мероприятия',
    headerStyle: {
      backgroundColor: '#159688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      events: [],
      refreshing: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.allEventsQuery.loading && !nextProps.allEventsQuery.error) {
      this.setState({
        events: nextProps.allEventsQuery.allEvents,
      })
    }
  }

  renderEvent = ({ item }) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity style={styles.recipe} onPress={() =>
          navigation.navigate('Event', {
            event: item
          })
        }>
        <View>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.allEventsQuery.refetch().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.events}
          renderItem={this.renderEvent}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15
  },
  recipe: {
    flex: 1,
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  createPostButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostButton: {
    backgroundColor: 'rgba(39,174,96,1)',
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    height: 60,
    width: 480,
    paddingTop: 18,
  }
})

export default graphql(allEventsQuery, {name: 'allEventsQuery'})(FeedScreen)
