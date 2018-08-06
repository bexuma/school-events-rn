import React, { Component } from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet, ScrollView, Image, AsyncStorage } from 'react-native';

export default class MyProfileScreen extends Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')

  };

  state = {
    name: '',
    isLoading: true
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then((user) => {
      // console.log(user)
      this.setState({
        isLoading: false,
        name: JSON.parse(user).name
      });
    });
  }

  render() {

    if (this.state.isLoading) {
      return <Text>SDFdfds</Text>
    }

    const Name = (
      <View style={styles.common}>
        <Text style={ styles.name }>{this.state.name}</Text>
      </View>
    );

    return (
      <ScrollView style={styles.container}>
  {/*      <View style={styles.image}>
          <Image
            style={{
              height: 120,
              width: 120,
              borderRadius: 200,
            }}
            resizeMode="contain"
            source={{
              uri: user.pic_url,
            }}
          />
        </View>*/}
        {Name}
        {/*<View style={styles.violetContainer}>
          <View style={styles.infoBlocks}>
            {User_events}
            {Followings}
            {Followers}
          </View>
          <FollowButton />
        </View>*/}
        <View style={styles.common}>
          <Text style={{ color: 'red', fontSize: 12}}>СЕЙЧАС</Text>
          <TouchableOpacity>
            <Text  style={{ fontWeight: 'bold', textAlign: 'center', color: '#282828' }}>Фотовыставка «Аркаим – Страна Городов: Пространство и Образы»</Text>
          </TouchableOpacity>
        </View>
        <Button
          title="logout"
          onPress={
            this._signOutAsync
          }
        />

      </ScrollView>
   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    flex: 3,
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '400',
    fontSize: 16
  },
  common: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 4,
  },
  violetContainer: {
    paddingLeft: 54,
    paddingRight: 54,
    paddingBottom: 12,
  },
  infoBlocks: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    flexDirection: 'row',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    width: 84,
  },
  numbers: {
    fontWeight: 'bold',
    color: '#7E2FFF',
  },
  nouns: {
    color: '#AE7CFF',
    fontSize: 12,
  },
});
