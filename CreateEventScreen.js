import React from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Image,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TimePickerAndroid,
  DatePickerAndroid,
  Dimensions,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { ImagePicker } from 'expo';
import Moment from 'moment';
require('moment/locale/ru.js');
// Moment.locale('ru');

const createEventMutation = gql`
  mutation(
    $title: String!,
    $description: String!,
    $image_name: String!,
    $site_url: String!,
    $address: String!,
    $starts_at: DateTime!,
    $ends_at: DateTime!,
    $prices: [PriceInput]
  ) {
    createEvent(
      title: $title,
      description: $description,
      image_name: $image_name,
      site_url: $site_url,
      address: $address,
      starts_at: $starts_at,
      ends_at: $ends_at,
      prices: $prices
    ) {
      id
    }
  }
`;

class CreateEventScreen extends React.Component {
  state = {
    title: '',
    description: '',
    site_url: '',
    address: '',
    starts_at: '',
    ends_at: '',
    prices: [],
    label: '',
    amount: '',
    image: '',
    isLoading: true,
  };

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      // console.log(user)
      this.setState({
        isLoading: false,
        username: JSON.parse(user).username,
      });
    });
  }

  handleAddPriceForm = () => {
    const price = {
      label: this.state.label,
      amount: parseInt(this.state.amount, 10),
    };

    this.setState({
      prices: [...this.state.prices, price],
      label: '',
      amount: '',
    });
  };

  getFormattedDateTime = (year, month, day, hour, minute) => {
    let tMonth, tDay, tHour, tMinute;

    tMonth = month <= 8 ? `0${month + 1}` : `${month + 1}`;
    tDay = day <= 9 ? `0${day}` : `${day}`;
    tHour = hour <= 9 ? `0${hour}` : `${hour}`;
    tMinute = minute <= 9 ? `0${minute}` : `${minute}`;

    return `${year}-${tMonth}-${tDay}T${tHour}:${tMinute}:00Z`;
  };

  handleSelectStartsAtForm = async () => {
    const currentDate = new Date();

    const { actionDatePicker, year, month, day } = await DatePickerAndroid.open(
      {
        minDate: currentDate,
        date: currentDate,
      }
    );

    const { actionTimePicker, hour, minute } = await TimePickerAndroid.open({
      hour: 14,
      minute: 0,
      is24Hour: true,
    });

    if (
      actionDatePicker !== DatePickerAndroid.dismissedAction &&
      actionTimePicker !== TimePickerAndroid.dismissedAction
    ) {
      this.setState({
        starts_at: this.getFormattedDateTime(year, month, day, hour, minute),
      });
    }
  };

  handleSelectEndsAtForm = async () => {
    const starts_at = Moment(this.state.starts_at).toDate();

    const { actionDatePicker, year, month, day } = await DatePickerAndroid.open(
      {
        minDate: starts_at,
        date: starts_at,
      }
    );

    const { actionTimePicker, hour, minute } = await TimePickerAndroid.open({
      hour: parseInt(Moment(this.state.starts_at).format('HH')), // GMT+0600 (East Kazakhstan Time)
      minute: parseFloat(Moment(this.state.starts_at).format('mm')),
      is24Hour: true,
    });

    if (
      actionDatePicker !== DatePickerAndroid.dismissedAction &&
      actionTimePicker !== TimePickerAndroid.dismissedAction
    ) {
      this.setState({
        ends_at: this.getFormattedDateTime(year, month, day, hour, minute),
      });
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  _createEvent = async imageUri => {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAJMHDUCEW2SQHAEJA',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });

    const timestamp = '' + Date.now();

    const params = {
      Bucket: 'senbi',
      Key: `images/${this.state.username}/${timestamp}.jpg`,
      ContentType: 'image/jpeg',
    };
    s3.getSignedUrl('putObject', params, function(err, url) {
      // console.log('Your generated pre-signed URL is', url);

      const request = new XMLHttpRequest();
      //request.open('PUT', url);
      request.onreadystatechange = e => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          // console.log('success', request.responseText);
          console.log('Image successfully uploaded to S3');
        } else {
          console.warn('Error while sending the image to S3');
        }

        if (e) {
          console.log(e);
        }
      };

      request.open('PUT', url);
      request.setRequestHeader('Content-Type', 'image/jpeg');
      request.send({
        uri: imageUri,
        type: 'image/jpeg',
        name: `${timestamp}.jpg`,
      });
    });

    try {
      const {
        title,
        description,
        address,
        site_url,
        starts_at,
        ends_at,
        prices,
      } = this.state;
      await this.props.createEventMutation({
        variables: {
          title,
          description,
          address,
          image_name: `${timestamp}`,
          site_url,
          starts_at,
          ends_at,
          prices,
        },
      });

      console.log('CREATED');
    } catch (err) {
      console.log('err', err);
    }
  };

  render() {
    // const { navigation } = this.props;
    // const allRecipesQuery = navigation.getParam('allRecipesQuery', '');
    // const authorId = navigation.getParam('authorId', '')
    let { image } = this.state;
    const limit = 78;

    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Название мероприятия"
            placeholder="Введите название мероприятия..."
            onChangeText={title => this.setState({ title })}
            value={this.state.title}
            maxLength={limit}
            multiline={true}
          />

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Описание мероприятия"
            multiline={true}
            placeholder="Добавьте описание..."
            onChangeText={description => this.setState({ description })}
            value={this.state.description}
          />

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Адрес мероприятия"
            placeholder="Введите адрес"
            onChangeText={address => this.setState({ address })}
            value={this.state.address}
          />

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Ссылка на сайт мероприятия"
            placeholder="Добавьте UPL-ссылку на сайт"
            onChangeText={site_url => this.setState({ site_url })}
            value={this.state.site_url}
          />

          <Text style={[styles.header, { paddingTop: 2 }]}>Цены</Text>

          <FlatList
            data={this.state.prices}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.label}: </Text>
                <Text>{item.amount}</Text>
              </View>
            )}
          />

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Лэйбл"
            placeholder="Добавьте лэйбл"
            onChangeText={label => this.setState({ label })}
            value={this.state.label}
          />

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Цена"
            placeholder="Добавьте цену для этой категории"
            onChangeText={amount => this.setState({ amount })}
            value={this.state.amount}
            keyboardType='numeric'
          />

          <TouchableOpacity
            onPress={this.handleAddPriceForm}
            style={styles.button}>
            <Text style={styles.buttonText}>Добавить цену</Text>
          </TouchableOpacity>
<View style={styles.dateTime}>
          <TouchableOpacity
            onPress={this.handleSelectStartsAtForm}
            style={styles.button}>
            <Text style={styles.buttonText}>Выбрать дату и время начала</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleSelectEndsAtForm}
            style={styles.button}>
            <Text style={styles.buttonText}>Выбрать дату и время конца</Text>
          </TouchableOpacity>
</View>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={{ height: 200, marginTop: 10 }}
            />
          ) : null}

          <TouchableOpacity
            style={[styles.button, styles.addImagebutton]}
            onPress={this.pickImage}>
            <Text style={styles.buttonText}>Choose an image</Text>
          </TouchableOpacity>
<View style={styles.centerAndPadding}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              this._createEvent(image.uri);
              this.props.navigation.goBack();
            }}>
            <Text style={styles.submitButtonText}>Создать мероприятие</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 0,
    marginTop: 24,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
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
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#26A69A',
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addImagebutton: {
    marginTop: 10,
    backgroundColor: '#009688',
  }, 
  dateTime:{
    flexDirection: 'row',
  },
  centerAndPadding: {
    alignItems: 'center', paddingTop: 8, 
  },
  submitButton: {
    height: 32,
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#26A4FF',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default graphql(createEventMutation, { name: 'createEventMutation' })(
  CreateEventScreen
);
