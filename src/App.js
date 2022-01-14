import React, { useRef, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  StyleSheet,
  View,
  Button,
  Alert,
  DrawerLayoutAndroid
} from 'react-native';
import { Text} from 'react-native-paper';
import { useHistory } from 'react-router-dom';
import { NativeRouter, Route } from "react-router-native";
import { _deleteUserData } from './utils';
import Login from './pages/Login';
import Home from './pages/Home';
import Detail from './pages/Detail';
import HeaderComponents from './components/HeaderComponents';


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
  let history = useHistory();
  const [user, setUsers] = useState([]);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("right");
  const _goBack = () => console.log('Went back');

  const logout = () => {
    Alert.alert("Hold on!", "Wants to logout?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "YES", onPress: () => {
           _deleteUserData();
        }
      }
    ]);
    return true;
  };

  const navigationView = () => (
    <View>
      <Text style={styles.sectionTitleDrawer}>Menu</Text>
      <Button
        color="#f03772"
        title="Logout"
        onPress={() => {
          logout();
          drawer.current.closeDrawer();
        }}
      />
    </View>
  );

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
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}
      >
        <HeaderComponents onPressDots={() => drawer.current.openDrawer()} />
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
      </DrawerLayoutAndroid>
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
  sectionTitleDrawer: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    marginHorizontal: 10
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
