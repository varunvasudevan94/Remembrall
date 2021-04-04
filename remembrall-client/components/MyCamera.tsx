import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function MyCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  console.log(title);
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
          /> : 
          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}> Add Image </Text>
          </TouchableOpacity>
        }
        {image !== "" ?
          <View>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={"Please enter a title"}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={reset}
            >
              <Text style={styles.buttonText}> Reset </Text>
            </TouchableOpacity> 
          </View>: null
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 0.5,
    margin: "5%"
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    margin: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderRadius: 5,
    backgroundColor: "#e83d66",
    marginTop: 15,
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
  },
});
