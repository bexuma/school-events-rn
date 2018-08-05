import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'

const createParticipationMutation = gql`
  mutation(
    $eventId: ID!
  ) {
    createParticipation(
      eventId: $eventId,
    ) {
      id
      event {
        numberOfParticipants
      }
    }
  }
`

class ActionButton extends Component {
  state = {
    pressed: false,
  };

  handleOnPress = async () => {
    const eventId = this.props.eventId
    try {
      const result = await this.props.createParticipationMutation({
       variables: {eventId}
      })

      this.setState(previousState => {
        return { pressed: !previousState.pressed };
      });

      this.props.updateParticipantsNumber(result.data.createParticipation.event.numberOfParticipants)
    }
    catch(e) {
      alert("Error, see the logs")
      console.log(e)
    }
    
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.handleOnPress}
      >
        <View
          style={[
            styles.general,
            this.state.pressed ? styles.pressed : styles.unpressed,
          ]}
        >
          <Text
            style={[
              styles.text,
              this.state.pressed ? styles.pressedText : styles.unpressedText,
            ]}
          >
            {this.state.pressed ? 'Вы идете' : 'Пойду'}
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


export default graphql(createParticipationMutation, {name: 'createParticipationMutation'})(ActionButton)
