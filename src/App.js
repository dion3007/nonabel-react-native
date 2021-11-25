import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  StyleSheet,
  View
} from 'react-native';
import { Text } from 'react-native-paper';
import { NativeRouter, Route } from "react-router-native";
import Login from './pages/Login';
import Home from './pages/Home';
import Detail from './pages/Detail';

const routess = [
  {
    path: "/",
    exact: true,
    main: Login
  },
  {
    path: "/bubblegum",
    main: Home
  },
  {
    path: "/detail",
    main: Detail
  },
  {
    path: "/shoelaces",
    main: () => <Text style={styles.header}>Shoelaces</Text>
  }
];

const App = () => {
  const [user, setUsers] = useState([]);
  
  useEffect(() => {
    if (user.length === 0) {
      firestore()
        .collection('users')
        .onSnapshot((doc) => {
          const newUser = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setUsers(newUser);
        });
    }
  }, [])

  return (
    <NativeRouter>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "#f0f0f0"
          }}
        >
          {routess.map((route, index) => (
            // You can render a <Route> in as many places
            // as you want in your app. It will render along
            // with any other <Route>s that also match the URL.
            // So, a sidebar or breadcrumbs or anything else
            // that requires you to render multiple things
            // in multiple places at the same URL is nothing
            // more than multiple <Route>s.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
        </View>

        <View>
          {routess.map((route, index) => (
            // Render more <Route>s with the same paths as
            // above, but different components this time.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </View>
      </View>
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
