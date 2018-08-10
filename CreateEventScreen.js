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
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { ImagePicker } from 'expo';
import Moment from 'moment';
require('moment/locale/ru.js');
// Moment.locale('ru');
import { Entypo, Ionicons } from '@expo/vector-icons';

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
  static navigationOptions = {
    title: 'Новое мероприятие',
    headerStyle: {
      backgroundColor: '#26A4FF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };
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
    addPriceFormIsOpened: false,
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
      id: new Date().getTime(),
    };
    this.setState(previousState => {
      return {
        addPriceFormIsOpened: !previousState.addPriceFormIsOpened,
        prices: [...this.state.prices, price],
        label: '',
        amount: '',
      };
    });
  };

  openAddPriceForm = () => {
    this.setState(previousState => {
      return { addPriceFormIsOpened: !previousState.addPriceFormIsOpened };
    });
  };

  removeItemFromList = itemToRemove => {
    this.setState({
      prices: this.state.prices.filter(item => item.id !== itemToRemove),
    });
  };

  getFormattedDateTime = (year, month, day, hour, minute) => {
    let tMonth, tDay, tHour, tMinute;

    tMonth = month <= 8 ? `0${month + 1}` : `${month + 1}`;
    tDay = day <= 9 ? `0${day}` : `${day}`;
    tHour = hour - 6 <= 9 ? `0${hour - 6}` : `${hour - 6}`;
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
      aspect: [16, 9],
    });

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  checkIfRequiredFieldsAreNotFilled = () =>
    this.state.starts_at === '' ||
    this.state.starts_at.length === 0 ||
    this.state.ends_at === '' ||
    this.state.ends_at.length === 0 ||
    this.state.title === '' ||
    this.state.title.length === 0;

  setInitialState = () => {
    this.setState({
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
      addPriceFormIsOpened: false,
    });
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

    try {
      const {
        title,
        description,
        address,
        site_url,
        starts_at,
        ends_at,
      } = this.state;

      const prices = this.state.prices.map ((price, index) => ({ label: price.label, amount: price.amount}))

      console.log(prices)

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
    } catch (err) {
      console.log('err', err);
    }  
  };

  render() {
    let { image } = this.state;
    const limit = 78;

    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={80}
        behavior="padding"
        enabled>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
          {image ? (
            <Image source={{ uri: image.uri }} style={{ height: 200 }} />
          ) : (
            <TouchableOpacity
              style={styles.addImagebutton}
              onPress={this.pickImage}>
              <Entypo name="image" size={120} color="#fff" />
              <Text
                style={[styles.buttonText, { fontSize: 15, color: '#fff' }]}>
                Добавьте изображение
              </Text>
            </TouchableOpacity>
          )}
          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Название мероприятия*"
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
          <Text style={styles.header}>Дата и время*</Text>
          <View style={styles.dateTime}>
            <TouchableOpacity onPress={this.handleSelectStartsAtForm}>
              {this.state.starts_at === '' ||
              this.state.starts_at.length === 0 ? (
                <Text style={styles.buttonText}>
                  Выберите дату и время начала
                </Text>
              ) : (
                <Text style={styles.buttonText}>
                  <Text style={{ color: 'grey' }}>Начало: </Text>
                  {Moment(this.state.starts_at).format('Do MMMM YYYY HH:mm')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {this.state.starts_at === '' ||
          this.state.starts_at.length === 0 ? null : (
            <View style={styles.dateTime}>
              <TouchableOpacity onPress={this.handleSelectEndsAtForm}>
                {this.state.ends_at === '' ||
                this.state.ends_at.length === 0 ? (
                  <Text style={styles.buttonText}>
                    Выберите дату и время конца
                  </Text>
                ) : (
                  <Text style={styles.buttonText}>
                    <Text style={{ color: 'grey' }}>Конец: </Text>
                    {Moment(this.state.ends_at).format('Do MMMM YYYY HH:mm')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Адрес мероприятия"
            placeholder="Введите адрес"
            onChangeText={address => this.setState({ address })}
            value={this.state.address}
          />

                    <Text
            style={[
              styles.header,
              this.state.addPriceFormIsOpened && this.state.prices.length !== 0 ? { paddingBottom: 0 } : null,
            ]}>
            Цены
          </Text>

          <FlatList
            data={this.state.prices}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemText}>
                  <Text style={{ fontSize: 15 }}>
                    {item.label ? `${item.label}: ` : ''}
                    {item.amount} тенге
                  </Text>
                </View>
                <View style={styles.itemRemoveButton}>
                  <TouchableOpacity
                    onPress={()=>this.removeItemFromList(item.id)}
                    style={styles.addPrice}>
                    <Ionicons
                      name="ios-remove-circle"
                      size={32}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          {this.state.addPriceFormIsOpened ? null : (
            <TouchableOpacity
              onPress={this.openAddPriceForm}
              style={styles.addPrice}>
              <Text style={styles.buttonText}>Добавить цену</Text>
            </TouchableOpacity>
          )}

          {this.state.addPriceFormIsOpened ? (
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 3, paddingRight: 16 }}>
                  <TextInput
                    theme={{ colors: { primary: '#26A4FF' } }}
                    underlineColor="#26A4FF"
                    label="Лэйбл"
                    onChangeText={label => this.setState({ label })}
                    value={this.state.label}
                    maxLength={limit}
                    multiline={true}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    theme={{ colors: { primary: '#26A4FF' } }}
                    underlineColor="#26A4FF"
                    label="Цена"
                    onChangeText={amount => this.setState({ amount })}
                    value={this.state.amount}
                    keyboardType="numeric"
                    maxLength={limit}
                    multiline={true}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={this.handleAddPriceForm}
                    style={styles.addPrice}>
                    <Ionicons
                      name="ios-add-circle"
                      size={32}
                      color="#26A4FF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}

          <TextInput
            theme={{ colors: { primary: '#26A4FF' } }}
            underlineColor="#26A4FF"
            label="Ссылка на сайт мероприятия"
            placeholder="Добавьте URL-ссылку на сайт"
            onChangeText={site_url => this.setState({ site_url })}
            value={this.state.site_url}
          />

          <View style={styles.centerAndPadding}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                if (this.checkIfRequiredFieldsAreNotFilled()) {
                  Alert.alert('Вы не заполнили все обязательные поля')
                } else {
                  this._createEvent(image.uri)
                  this.setInitialState();
                  this.props.navigation.navigate('Feed');
                }
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
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0E334E',
    paddingTop: 12,
    paddingBottom: 12,
  },
  dateTime: {
    paddingBottom: 8,
  },
  item: {
    flex: 1,
    paddingTop: 4,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  itemText: {
    flex: 4,
  },
  itemRemoveButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonText: {
    color: '#26A4FF',
    fontSize: 15,
  },
  addImagebutton: {
    paddingTop: 8,
    height: 200,
    width: Dimensions.get('window').width - 32,
    backgroundColor: '#86CCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAndPadding: {
    alignItems: 'center',
    paddingTop: 8,
  },
  addPrice: {
    paddingBottom: 8,
  },
  submitButton: {
    height: 32,
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#26A4FF',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default graphql(createEventMutation, { name: 'createEventMutation' })(
  CreateEventScreen
);
