import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import SwipeButton from 'rn-swipe-button';

const swipeSubmit = () => {
  // Do the async job here
  ToastAndroid.show('Reminder Submitted', ToastAndroid.SHORT);
}

const FREQUENCY = ['Most Frequent Reminders', 'Remind in some time', 'Remind me only tommorow'];

export default function MyCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState(FREQUENCY[0]);

  const reset = () => {
    setImage("");
    setTitle("");
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    await MediaLibrary.saveToLibraryAsync(`${result.uri}`);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image !== "" ?
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.button}
              onPress={reset}
            >
              <Text style={styles.buttonText}> Reset </Text>
            </TouchableOpacity>

            <Image
              source={{
                uri: image,
                method: 'POST',
                headers: {
                Pragma: 'no-cache',
                },
                body: 'Your Body goes here',
              }}
              style={styles.camera}
            /> 
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={"Please enter a title"}
            />
            
  
            <View style={styles.input}>
              <Picker
                selectedValue={selectedFrequency}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                setSelectedFrequency(FREQUENCY[itemIndex])}
                style={styles.picker}
              >
                {FREQUENCY.map(x => <Picker.Item label={x} value={x} key={x} />)}
              </Picker>
            </View>
            
            <SwipeButton
              railBackgroundColor={styles.button.backgroundColor}
              shouldResetAfterSuccess
              onSwipeSuccess={swipeSubmit}
              resetAfterSuccessAnimDelay={1000}
              title="Swipe to remember"
              titleColor="white"
              titleFontSize={20}
            />
          </View>
          :
          <View style={styles.container}>
            <View style={{...styles.camera, backgroundColor: 'grey'}} />
            <TouchableOpacity
              style={styles.button}
              onPress={pickImage}
            >
              <Text style={styles.buttonText}> Add Image </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "1%"
  },
  camera: {
    flex: 0.5,
    marginBottom: "5%"
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    margin: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#e83d66",
    marginTop: 15,
    margin: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#e3e3e3",
    backgroundColor: "#fff",
    margin: 10
  },
  picker: {
    color: 'black',
  },
});
