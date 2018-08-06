import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'

const createParticipationMutation = gql`
  mutation(
    $eventId: ID!
  ) {
    createParticipation(
      eventId: $eventId,
    ) {
      event {
        participantIds
      }
    }
  }
`

const deleteParticipationMutation = gql`
  mutation(
    $eventId: ID!
  ) {
    deleteParticipation(
      eventId: $eventId,
    ) {
      event {
        participantIds
      }
    }
  }
`

class ActionButton extends Component {
  state = {
    isLoading: true
  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('user').then((user) => {
      this.setState({
        isLoading: false,
        userId: JSON.parse(user).id
      });
    });

    const isParticipating = this.props.participantIds.includes(parseInt(this.state.userId))

    this.setState({
      isParticipating: isParticipating
    })
  }

  handleOnPress = async () => {
    const eventId = this.props.eventId

    try {
      if (this.state.isParticipating) {
        const result = await this.props.deleteParticipationMutation({
         variables: {eventId}
        })

        this.props.updateNumberOfParticipants(result.data.deleteParticipation.event.participantIds.length)

      } else {
        const result = await this.props.createParticipationMutation({
         variables: {eventId}
        })

        this.props.updateNumberOfParticipants(result.data.createParticipation.event.participantIds.length)
      }

      this.setState(previousState => {
        return { isParticipating: !previousState.isParticipating };
      });
       
    }
    catch(e) {
      console.log(e)
    }
    
  };

  render() {
    if (this.state.isLoading) {
      return <View></View>
    }

    return (
      <TouchableOpacity
        onPress={this.handleOnPress}
      >
        <View
          style={[
            styles.general,
            this.state.isParticipating ? styles.pressed : styles.unpressed,
          ]}
        >
          <Text
            style={[
              styles.text,
              this.state.isParticipating ? styles.pressedText : styles.unpressedText,
            ]}
          >
            {this.state.isParticipating ? 'Вы идете' : 'Пойду'}
          </Text>
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    height: 32,
    width: 328,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7E2FFF',
  },
  unpressed: {
    backgroundColor: 'white',
  },
  pressed: {
    backgroundColor: '#7E2FFF',
  },
  text: {
    fontWeight: '500',
  },
  unpressedText: {
    color: '#7E2FFF',
  },
  pressedText: {
    color: 'white',
  },
});

export default compose(graphql(createParticipationMutation, {name: 'createParticipationMutation'}), graphql(deleteParticipationMutation, {name: 'deleteParticipationMutation'}))(ActionButton)
