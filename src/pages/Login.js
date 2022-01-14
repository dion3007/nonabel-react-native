import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
  ScrollView
} from 'react-native';
import { useHistory } from "react-router-dom";
import auth from '@react-native-firebase/auth';
import { _storeUserData, _retrieveUserData, _storeThePage } from '../utils';

const Login = () => {
  let history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(async () => {
    _storeThePage('login');
    const userData = await _retrieveUserData();
    if (userData) {
      history.push("/bubblegum");
    }
  })

  const handleSubmit = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('User account created & signed in!', response);
        _storeUserData(response);
        history.push("/bubblegum");
      })
      .catch((error) => console.log('User account created & signed in!', error))
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://nonable-admin.vercel.app/static/logo.png',
            }}
          />
          <TextInput
            style={styles.input}
            onChangeText={(e) => setEmail(e)}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            onChangeText={(e) => setPassword(e)}
            placeholder="Password"
            secureTextEntry
          />
          <View
            style={styles.buttonClass}
          >
            <Button
              onPress={handleSubmit}
              title="Login"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 50,
    alignSelf: "center",
    marginTop: 150,
    marginBottom: 100
  },
  container: {
    padding: 24,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#bbbdbf',
    padding: 10,
  },
  buttonClass: {
    width: '50%',
    borderRadius: 5,
    alignSelf: "center",
  }
});

export default Login;