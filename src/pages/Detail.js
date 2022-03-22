import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  BackHandler,
  Alert
} from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { useLocation, useHistory } from 'react-router-dom';
import firestore from '@react-native-firebase/firestore';
import { _retrieveUserData, _storeThePage } from '../utils';
import moment from 'moment';

const Detail = () => {
  let history = useHistory();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [itemRate, setItemRate] = useState([]);
  const [variable, setVariable] = useState([]);
  const [userData, setUserData] = useState();
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(true);

  const onDismissSnackBar = () => setVisible(false);


  const backAction = () => {
    Alert.alert("Hold on!", "Back to main?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => history.push("/bubblegum") }
    ]);
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  useEffect(async () => {
    if (!userData) {
      _storeThePage('detail');
      const userData = await _retrieveUserData();
      setUserData(userData);
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
    if (itemRate.length === 0) {
      firestore()
        .collection('itemrate')
        .onSnapshot((doc) => {
          const newRate = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setItemRate(newRate);
        });
    }
    if (variable.length === 0) {
      firestore()
        .collection('variable')
        .onSnapshot((doc) => {
          const newVar = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setVariable(newVar);
        });
    }
    return () => backHandler.remove();
  })

  const filteredJobs = jobs?.filter((job) => job.id === location.state.id);
  const filteredDataClient = clients.filter((client) => client.id === filteredJobs[0]?.customer)

  const [onEditHour, setOnEditHour] = useState(false);
  const [onEditDistance, setOnEditDistance] = useState(false);

  const [onEditExpense, setOnEditExpense] = useState(false);
  const [onEditExpenseReason, setOnEditExpenseReason] = useState(false);
  const [distance, setDistance] = useState("");
  const [hour, setHour] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseReason, setExpenseReason] = useState("");

  const _updateDataJobsDistance = () => {
    const driverPaids = filteredJobs[0]?.incentive ? filteredJobs[0]?.incentive * Number(hour ? hour : filteredJobs[0]?.hour) + Number(variable[0]?.driverKms * Number(distance ? distance : filteredJobs[0].distance)) + Number(expense ? expense : filteredJobs[0]?.expensePrice)
      : variable[0]?.empRate * Number(hour ? hour : filteredJobs[0]?.hour) + Number(variable[0]?.driverKms * Number(distance ? distance : filteredJobs[0].distance)) + Number(expense ? expense : filteredJobs[0]?.expensePrice);
    const itemRates = itemRate.filter((items) => items.id === filteredJobs[0]?.item) || 0;
    const price = itemRates[0]?.rate * Number(hour ? hour : filteredJobs[0]?.hour)
      + variable[0]?.nonableKms * Number(distance ? distance : filteredJobs[0].distance) + Number(expense ? expense : filteredJobs[0]?.expensePrice);

    const profit = (itemRates[0]?.rate * Number(hour ? hour : filteredJobs[0]?.hour) +
      (variable[0]?.nonableKms * Number(distance ? distance : filteredJobs[0].distance))
      + Number(expense ? expense : filteredJobs[0]?.expensePrice))
      - (filteredJobs[0]?.incentive ? (filteredJobs[0]?.incentive * Number(hour ? hour : filteredJobs[0]?.hour))
        + ((variable[0]?.driverKms * Number(distance ? distance : filteredJobs[0].distance))
          + Number(expense ? expense : filteredJobs[0]?.expensePrice))
        : (variable[0]?.empRate * Number(hour ? hour : filteredJobs[0]?.hour))
        + (variable[0]?.driverKms * Number(distance ? distance : filteredJobs[0].distance)
          + Number(expense ? expense : filteredJobs[0]?.expensePrice)));
    onToggleSnackBar();
    firestore()
      .collection('jobs')
      .doc(filteredJobs[0]?.id)
      .set({
        customer: filteredJobs[0]?.customer,
        driver: filteredJobs[0]?.driver,
        notes: filteredJobs[0]?.notes,
        pickUp: filteredJobs[0]?.pickUp,
        bookingTime: filteredJobs[0]?.bookingTime.toString(),
        item: filteredJobs[0]?.item,
        price: price || 0,
        profit: profit,
        driverPaid: driverPaids,
        bookingDate: filteredJobs[0]?.bookingDate.toString(),
        dropOff: filteredJobs[0]?.dropOff,
        incentive: filteredJobs[0]?.incentive || 0,
        expensePrice: expense ? expense : filteredJobs[0]?.expensePrice,
        expenseReason: expenseReason ? expenseReason : filteredJobs[0]?.expenseReason,
        hour: hour ? hour : filteredJobs[0]?.hour,
        distance: distance ? distance : filteredJobs[0]?.distance,
        date: new Date(),
        duplicate: true,
        paid: false,
        jobStat: 2
      });
    history.push({
      pathname: '/bubblegum'
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.item}>
          <Text style={styles.client}>{filteredDataClient[0]?.name}</Text>
          <View style={{ flexDirection: 'column', marginBottom: 20 }}>
            <Text style={styles.title}>Pickup Location:</Text>
            <Text style={styles.subtitle}>{filteredJobs[0]?.pickUp}</Text>
          </View>
          <View style={styles.wrapperDestination}>
            <Text style={styles.title}>Destination:</Text>
            <Text style={styles.subtitle}>{filteredJobs[0]?.dropOff}</Text>
          </View>
          <View style={styles.wrapperDestination}>
            <Text style={styles.title}>Date:</Text>
            <Text style={styles.subtitle}>{moment(filteredJobs[0]?.bookingDate).format("DD-MM-YYYY")}</Text>
          </View>
          <View style={styles.wrapperDestination}>
            <Text style={styles.title}>Time:</Text>
            <Text style={styles.subtitle}>{moment(filteredJobs[0]?.bookingTime).format("h:mm a")}</Text>
          </View>
          <Text style={styles.to}>{filteredJobs[0]?.notes}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.from}>Distance</Text>
          <TextInput
            style={styles.input}
            editable={filteredJobs[0]?.jobStat === 1 || filteredJobs[0]?.jobStat === 2 ? true : false}
            onChangeText={(e) => {
              setOnEditDistance(true)
              setDistance(e)
            }}
            value={onEditDistance ? distance : filteredJobs[0]?.distance}
            keyboardType="number-pad"
            placeholder="Km"
          />
          <Text style={styles.from}>Hour</Text>
          <TextInput
            style={styles.input}
            editable={filteredJobs[0]?.jobStat === 1 || filteredJobs[0]?.jobStat === 2 ? true : false}
            onChangeText={(e) => {
              setOnEditHour(true)
              setHour(e)
            }}
            value={onEditHour ? hour : filteredJobs[0]?.hour}
            keyboardType="number-pad"
            placeholder="HH"
          />
          <Text style={styles.from}>Expense</Text>
          <TextInput
            style={styles.input}
            editable={filteredJobs[0]?.jobStat === 1 || filteredJobs[0]?.jobStat === 2 ? true : false}
            onChangeText={(e) => {
              setOnEditExpense(true)
              setExpense(e)
            }}
            value={onEditExpense ? expense : filteredJobs[0]?.expensePrice}
            placeholder="Expense"
          />
          <Text style={styles.from}>Expense Reason</Text>
          <TextInput
            style={styles.inputArea}
            editable={filteredJobs[0]?.jobStat === 1 || filteredJobs[0]?.jobStat === 2 ? true : false}
            onChangeText={(e) => {
              setOnEditExpenseReason(true)
              setExpenseReason(e)
            }}
            value={onEditExpenseReason ? expenseReason : filteredJobs[0]?.expenseReason}
            placeholder="Expense Reason"
            multiline
            numberOfLines={4}
          />
          <Button
            disabled={filteredJobs[0]?.jobStat === 1 || filteredJobs[0]?.jobStat === 2 ? false : true}
            mode="contained"
            color="#6ce68a"
            onPress={() => _updateDataJobsDistance()}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={styles.snackbarStyle}
      >
        Data submitted
      </Snackbar>
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
    marginHorizontal: 16
  },
  snackbarStyle: {
    backgroundColor: '#69c27f'
  },
  title: {
    fontSize: 18,
  },
  client: {
    fontSize: 24,
    marginBottom: 20
  },
  from: {
    fontSize: 14,
    fontWeight: "600",
  },
  money: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0cf054"
  },
  to: {
    fontSize: 14,
    fontWeight: "600",
  },
  wrapperDestination: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wrapperContent: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  subtitle: {
    maxWidth: 250,
    fontSize: 16,
  },
  buttonCard: {
    marginRight: 5,
    marginTop: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#bbbdbf',
    padding: 10,
  },
  inputArea: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#bbbdbf',
    padding: 10,
  },
});

export default Detail;