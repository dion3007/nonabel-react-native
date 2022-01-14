import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  Button,
  BackHandler,
  ScrollView,
} from 'react-native';
import { useHistory } from "react-router-dom";
import firestore from '@react-native-firebase/firestore';
import { _retrieveUserData } from '../utils';
import moment from 'moment';

const Item = ({ item, clients }) => {
  let history = useHistory();
  const _updateDataJobs = (value) => {
    firestore()
      .collection('jobs')
      .doc(item.id)
      .set({
        customer: item?.customer,
        driver: item?.driver,
        notes: item?.notes,
        pickUp: item?.pickUp,
        price: item?.price ? item?.price : 0,
        profit: item?.profit,
        driverPaid: item?.driverPaid,
        bookingDate: item?.bookingDate.toString(),
        bookingTime: item?.bookingTime.toString(),
        item: item?.item,
        dropOff: item?.dropOff,
        expensePrice: 0,
        expenseReason: 'none',
        hour: item?.hour,
        distance: item?.distance,
        date: new Date(),
        duplicate: true,
        paid: false,
        jobStat: value
      });
  }
  const handleBackButton = () => {
    BackHandler.exitApp()
  }
  BackHandler.addEventListener('hardwareBackPress', handleBackButton);

  return (
    <View style={styles.item}>
      <View style={styles.wrapperContent}>
        <View>
          <Text style={styles.client}>
            {clients.filter((client) => client.id === item.customer)[0]?.name}
          </Text>
        </View>
        <Text style={styles.subtitle}>
          {item.jobStat === 0 && "Requested"}
          {item.jobStat === 1 && "Confirmed"}
          {item.jobStat === 2 && "On Going"}
          {item.jobStat === 3 && "Completed"}
          {item.jobStat === 4 && "on Cancelled"}
          {item.jobStat === 6 && "Cancelled"}
          {item.jobStat === 5 && 'Paid'}
          {item.jobStat === 8 && 'confirm completed'}
        </Text>
      </View>
      <View style={{ flexDirection: 'column', marginBottom: 20 }}>
        <Text style={styles.title}>Pickup Location:</Text>
        <Text style={styles.subtitle}>{item.pickUp}</Text>
      </View>
      <View style={styles.wrapperDestination}>
        <Text style={styles.title}>Destination:</Text>
        <Text style={styles.subtitle}>{item.dropOff}</Text>
      </View>
      <View style={styles.wrapperDestination}>
        <Text style={styles.title}>Date:</Text>
        <Text style={styles.subtitle}>{moment(item?.bookingDate).format("DD-MM-YYYY")}</Text>
      </View>
      <View style={styles.wrapperDestination}>
        <Text style={styles.title}>Time:</Text>
        <Text style={styles.subtitle}>{moment(item?.bookingTime).format("h:mm a")}</Text>
      </View>
      <View style={styles.wrapperFlex}>
        <View style={styles.wrapperAction}>
          <View style={styles.buttonCard}>
            <Button
              onPress={() => history.push({
                pathname: '/detail',
                state: {
                  id: item.id
                }
              })}
              title="detail"
            />
          </View>
          {item.jobStat === 0 && (
            <View style={styles.buttonCard}>
              <Button
                onPress={() => _updateDataJobs(item.jobStat < 5 ? item.jobStat + 1 : 0)}
                title="Confirm"
              />
            </View>
          )}
          {item.jobStat === 0 || item.jobStat === 1 && (
            <View style={styles.buttonCard}>
              <Button
                onPress={() => _updateDataJobs(4)}
                color="#ff2679"
                title="Cancel"
              />
            </View>
          )}
          {item.jobStat === 2 && (
            <View style={styles.buttonCard}>
              <Button
                onPress={() => _updateDataJobs(8)}
                color="#0cfa28"
                title="Completed"
              />
            </View>
          )}
          {item.jobStat === 4 && (
            <View style={styles.buttonCard}>
              <Button
                disabled
                title="Pending"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  )
};

const Home = () => {
  let history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [userData, setUserData] = useState();
  const homepage = 'home';
  useEffect(async () => {
    const userData = await _retrieveUserData();
    if (userData) {
      setUserData(userData.user);
    } else {
      setUserData([]);
      history.push('/');
    }
    if (jobs.length === 0) {
      firestore()
        .collection('jobs')
        .onSnapshot((doc) => {
          const newJobs = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setJobs(newJobs);
        });
    }
    if (drivers.length === 0) {
      firestore()
        .collection('drivers')
        .onSnapshot((doc) => {
          const newDrivers = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setDrivers(newDrivers);
        });
    }
    if (clients.length === 0) {
      firestore()
        .collection('clients')
        .onSnapshot((doc) => {
          const newClients = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setClients(newClients);
        });
    }
  }, [userData])

  const filteredDataDrivers = drivers.filter((driver) => driver.email === userData.email)
  const filteredDataJobs = jobs.filter((job) => job.driver === filteredDataDrivers[0]?.id)

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 250 }}>
        {filteredDataJobs.length > 0 ? filteredDataJobs.map((item) => {
          return (
            <Item
              item={item}
              clients={clients}
            />
          )
        }) : (
          <View style={{ marginTop: 100, alignSelf: 'center' }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={{
                uri: 'https://static.thenounproject.com/png/1496955-200.png',
              }}
            />
            <Text style={{ textAlign: 'center' }}>no order</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
    borderStyle: 'solid',
    borderColor: '#a9acb0',
    borderRadius: 5,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  client: {
    fontSize: 24,
    marginBottom: 30
  },
  wrapperDestination: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wrapperAction: {
    flexDirection: "row",
    width: 160,
    marginTop: 20
  },
  wrapperFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20
  },
  wrapperContent: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  subtitle: {
    fontSize: 16,
  },
  timesub: {
    fontSize: 16,
    marginTop: 25
  },
  money: {
    fontSize: 16,
    color: '#0cf054'
  },
  buttonCard: {
    marginRight: 5,
    marginTop: 5
  }
});

export default Home;