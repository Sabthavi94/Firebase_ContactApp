import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import { Card } from "native-base";
import { Entypo } from "@expo/vector-icons";
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
 
  
  constructor(props) {
    super(props);
     this.state = {
      data: [],
      isLoading: true,
      isListEmpty: false
    };
  }
 
  componentDidMount() {
    this.getAllContact();
  }
 
  getAllContact = () => {
    let self = this;
    let contactRef = firebase.database().ref();
    //on listener will be called every time if there any changes happen in contact list
    contactRef.on("value",dataSnapshot=>{
      if(dataSnapshot.val()){
        let contactResult= Object.values(dataSnapshot.val());
        let  contactKey = Object.keys(dataSnapshot.val());
        contactKey.forEach((value, key)=>{
          contactResult [key] ["key"] = value;
        })

        self.setState({
          data: contactResult.sort((a,b)=>{
            var nameA = a.fname.toUpperCase();
            var nameB = b.fname.toUpperCase();
    
            if(nameA<nameB){
              return -1;
            }
            if(nameA>nameB){
              return 1;
            }
            return 0;
          }),
          isListEmpty:false
          
        })
      }
      else{
        self.setState({ isListEmpty:true });
      }
      self.setState({ isLoading:false });

    });

    
  };

  // render method
  render() {
    // if its loading show ActivityIndicator
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text style={{ textAlign: "center" }}>
            Contacts loading please wait..
          </Text>
        </View>
      );
    } else if (this.state.isListEmpty) {
      // else if loading is completed and no contact found show this
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <Entypo style={{ alignSelf: "center" }} name="plus" size={35} />
          <Text style={{ textAlign: "center" }}>No Contacts please Add</Text>
          <TouchableOpacity
            onPress={() => {
              // add icon
              //navigate to Add Contact screen
              this.props.navigation.navigate("Add");
            }}
            style={styles.floatButton}
          >
            <Entypo name="plus" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    // return list of contacts
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  //navigate to view contact screen with passing key
                  this.props.navigation.navigate("View", {
                    key: item.key
                  });
                }}
              >
                <Card style={styles.listItem}>
                  <View>
                    <Image
                      style={styles.contactIcon}
                      source={
                        item.imageUrl === "empty"
                          ? require("../assets/person.png")
                          : { uri: item.imageDownloadUrl }
                      }
                    />
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                      {item.fname} {item.lname}
                    </Text>
                    <Text style={styles.infoText}>{item.phone}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          onPress={() => {
            // add icon
            //navigate to Add Contact screen
            this.props.navigation.navigate("Add");
          }}
          style={styles.floatButton}
        >
          <Entypo name="plus" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  listItem: {
    flexDirection: "row",
    padding: 20
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 100
  },
  infoContainer: {
    flexDirection: "column"
  },
  infoText: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 10,
    paddingTop: 2
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: "#B83227",
    borderRadius: 100
  }
});
