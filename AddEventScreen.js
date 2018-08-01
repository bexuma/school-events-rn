import React from 'react'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import { View, ScrollView, TouchableOpacity, FlatList, Image, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';
import { ImagePicker } from 'expo';

// const createEventMutation = gql`
//   mutation ($title: String!, $description: String!, $site_url: [String!]!, $starts_at: [String!]!, $ends_at: String!, $prices: [Price!]!){
//     createEvent(title: $title, description: $description, site_url: $site_url, starts_at: $starts_at, ends_at: $ends_at, prices: $prices) {
//       id
//     }
//   }
// `

const createEventMutation = gql`
  mutation ($title: String!, $description: String!, $site_url: String!, $prices: [PriceInput]){
    createEvent(title: $title, description: $description, site_url: $site_url, prices: $prices) {
      id
    }
  }
`

class AddEventScreen extends React.Component {
  static navigationOptions = {
    title: 'Create new recipe',
    headerStyle: {
      backgroundColor: '#009688',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  };

  state = {
    title: '',
    description: '',
    site_url: '',
    // starts_at: '',
    // ends_at: '',
    prices: [],
    label: '',
    amount: ''
  }

  handleAddPriceForm = () => {
    const price = {
      label: this.state.label,
      amount: parseInt(this.state.amount , 10 )
    }

    this.setState({
      prices: [...this.state.prices, price],
      label: '',
      amount: ''
    })
  }

  _createEvent = async () => {
    try {
      const {title, description, site_url, prices} = this.state
      await this.props.createEventMutation({
       variables: {title, description, site_url, prices}
      })

      console.log("CREATED")

    } catch (err) {
      console.log('err', err)
    }
    
  }

  render () {
    // const { navigation } = this.props;
    // const allRecipesQuery = navigation.getParam('allRecipesQuery', '');
    // const authorId = navigation.getParam('authorId', '')
    // let { image } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}
        keyboardVerticalOffset={32}
        enabled
      >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        <TextInput
          label='Title'
          underlineColor="#159688"
          placeholder='Recipe title...'
          onChangeText={title => this.setState({ title })}
          value={this.state.title}
        />

        <TextInput
          label='Description'
          multiline={true}
          underlineColor="#159688"
          placeholder='Type a description...'
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />

        <TextInput
          label='Site URL'
          underlineColor="#159688"
          placeholder='Event site'
          onChangeText={site_url => this.setState({ site_url })}
          value={this.state.site_url}
        />

        <Text style={[styles.header, {paddingTop: 2}]}>Prices</Text>

        <FlatList
          data={this.state.prices}
          renderItem={({item}) => <View style={styles.item}><Text style={styles.itemText}>{item.label}</Text><Text>{item.amount}</Text></View>}
        />

        <TextInput
          label='Label'
          underlineColor="#159688"
          onChangeText={label => this.setState({ label })}
          value={this.state.label}
        />

        <TextInput
          label='Amount'
          underlineColor="#159688"
          onChangeText={amount => this.setState({ amount })}
          value={this.state.amount}
        />

        <TouchableOpacity
          onPress={this.handleAddPriceForm}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Add Price
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            this._createEvent();
            this.props.navigation.goBack()
          }}
        >
          <Text style={styles.submitButtonText}>
            Create Event
          </Text>
        </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>
    )
  }

}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#757575",
    marginTop: 10
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 15
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#26A69A',
    padding: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  },
  addImagebutton: {
    marginTop: 10,
    backgroundColor: '#009688',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#00796B',
    padding: 10,
    marginTop: 10,
    marginBottom: 16
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 18
  },
  
})

export default graphql(createEventMutation, {name: 'createEventMutation'})(AddEventScreen)