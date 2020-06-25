import React, { Component } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";

import {v4 as uuidv4} from 'uuid';

import * as ImagePicker from 'expo-image-picker';

import { Form, Item, Input, Label, Button } from "native-base";



import * as firebase from 'firebase';

export default class EditContact extends Component {
 

  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      phone: "",
      email: "",
      address: "",
      image: "empty",
      imageDownloadUrl: "empty",
      isUploading: false,
      isLoading: true,
      key: ""
    };
  }

  componentDidMount() {
    const {navigation}=this.props;
    // navigation.addListener("WillFocus",()=>{
      var {key} = this.props.route.params;
      this.getContact(key);
    // });
  }
  
  getContact =async key => {
    let self=this;
    let contactRef= firebase.database().ref().child(key);

  await contactRef.on("value", dataSnapshot =>{
    if (dataSnapshot.val()) {
      var contactValue= dataSnapshot.val();
      self.setState({
        fname:contactValue.fname,
        lname:contactValue.lname,
        email:contactValue.email,
        phone:contactValue.phone,
        address:contactValue.address,
        imageDownloadUrl:contactValue.imageDownloadUrl,
        key:key,
        isLoading:false
        
      })
    }
  })
  };

 
  updateContact = async key => {
    const dbReference= firebase.database().ref();
    const storageReference= firebase.storage().ref();
    if (
      this.state.fname!=="" &&
      this.state.lname!=="" &&
      this.state.phone!=="" &&
      this.state.email!=="" &&
      this.state.address!=="" 
    ) {
      this.setState({isUploading:true});
      

      if(this.state.image !== "empty"){
        const downloadURL = await this.uploadImageAsync(this.state.image,storageReference);
        this.setState({imageDownloadUrl:downloadURL})
      }
    }

    
     
    await dbReference.child(key).update({
      fname: this.state.fname,
      lname: this.state.lname,
      phone: this.state.phone,
      email: this.state.email,
      address: this.state.address,
      imageDownloadUrl: this.state.imageDownloadUrl,
    }, error =>{
      if(!error){
        return this.props.navigation.goBack();
      }
    })
  };

  //TODO: pick image from gallery
  pickImage = async () => {
    let result= await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing:true,
      aspect:[1,1]
    }) ;
    if (!result.cancelled) {
      this.setState({
        image: result.uri
      });
    }
  };

  //TODO: upload to firebase
  uploadImageAsync = async (uri, storageRef) => {
    const parts= uri.split(".");
    const fileExtension= parts[parts.length-1]; // can go for 0,1

    //create blob
    const blob= await new Promise((resolve, reject)=>{
      const xhr= new XMLHttpRequest();
      xhr.onload = function(){
        resolve(xhr.response)
      };
      xhr.onerror= function(e){
        console.log(e);
        reject(new TypeError("Network request failed"))
       };
       xhr.responseType= "blob";
       xhr.open("GET", uri, true);
       xhr.send(null);
    })

    //semd to firebase
    const ref= storageRef
    .child("ContactImages")
    .child(uuidv4() + "." +fileExtension) // give unique name to each image
    const snapshot= await ref.put(blob);

    //close the blob
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  // render method
  render() {
    if (this.state.isUploading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text style={{ textAlign: "center" }}>
            Contact Updateing please wait..
          </Text>
        </View>
      );
    }
    return (
      // <KeyboardAvoidingView
      //   // keyboardVerticalOffset={Header.HEIGHT + 20} // adjust the value here if you need more padding
      //   style={{ flex: 1 }}
      //   behavior="padding"
      // >
      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            // dismiss the keyboard if touch any other area then input
            Keyboard.dismiss();
          }}
        >
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.pickImage();
              }}
            >
              <Image
                source={
                  this.state.imageDownloadUrl === "empty"
                    ? require("../assets/person.png")
                    : {
                        uri: this.state.imageDownloadUrl
                      }
                }
                style={styles.imagePicker}
              />
            </TouchableOpacity>
            <Form>
              <Item style={styles.inputItem} floatingLabel>
                <Label>First Name</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={fname => this.setState({ fname })}
                  value={
                    // set current contact value to input box
                    this.state.fname
                  }
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Last Name</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={lname => this.setState({ lname })}
                  value={this.state.lname}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Phone</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={phone => this.setState({ phone })}
                  value={this.state.phone}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Email</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Address</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={address => this.setState({ address })}
                  value={this.state.address}
                />
              </Item>
            </Form>

            <Button
              style={styles.button}
              full
              rounded
              onPress={() => {
                this.updateContact(this.state.key);
              }}
            >
              <Text style={styles.buttonText}>Update</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
        </ScrollView>
    );
  }
}
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10
  },
  inputItem: {
    margin: 10
  },
  imagePicker: {
    justifyContent: "center",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: "#c1c1c1",
    borderWidth: 2
  },
  button: {
    backgroundColor: "#B83227",
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
