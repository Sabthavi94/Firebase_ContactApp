import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddNewContact from './screens/AddNewContact';
import EditContact from './screens/EditContact';
import ViewContact from './screens/ViewContact';
import * as firebase from 'firebase';


const Stack = createStackNavigator();

//TODO: Initialize Firebase



class App extends React.Component {

  
  
  render(){
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Home" 
      screenOptions={{
        headerTintColor:"#fff",
        headerStyle:{
          backgroundColor:"#b83227"
        },
        headerTitleStyle:{
          color:"#fff"
        }
      }}
      >
        <Stack.Screen name="Home" component={HomeScreen}  options={{title:"Contact App"}}/>
        <Stack.Screen name="Add" component={AddNewContact} options={{title:"Add Contact"}} />
        <Stack.Screen name="Edit" component={EditContact} options={{title:"Edit Contact"}} />
        <Stack.Screen name="View" component={ViewContact}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


}
var firebaseConfig = {
  apiKey: "AIzaSyCZ84U1JVn3henUMqncLGljEiTcFMgY-cQ",
  authDomain: "reactnativecourse-53f6d.firebaseapp.com",
  databaseURL: "https://reactnativecourse-53f6d.firebaseio.com",
  projectId: "reactnativecourse-53f6d",
  storageBucket: "reactnativecourse-53f6d.appspot.com",
  messagingSenderId: "695062245574",
  appId: "1:695062245574:web:0a42bcf943e38c3d71a7c7",
  measurementId: "G-2BXCKPPQ5C"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//FirebaseTODO create firebase real-time database with rules

export default App;