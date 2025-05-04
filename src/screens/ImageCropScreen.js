import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CropView } from 'react-native-image-crop-tools';

const ImageCropScreen = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const cropRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleCrop = () => {
    try {
      setIsLoading(true);
      cropRef.current.saveImage(true, 90); // keep transparency: true, quality: 90
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong while cropping.');
    }
  };

  return (
    <View style={styles.container}>
      <CropView
        sourceUrl={imageUri}
        style={styles.cropView}
        ref={cropRef}
        keepAspectRatio
        aspectRatio={{ width: 1, height: 1 }}
        onImageCrop={(res) => {
          setIsLoading(false);
          navigation.navigate('UserInfo', { croppedImage: res.uri });
        }}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" style={{ position: 'absolute', bottom: 50 }} />
      ) : (
        <TouchableOpacity style={styles.cropButton} onPress={handleCrop}>
          <Text style={styles.cropButtonText}>CROP & SAVE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cropView: {
    flex: 1,
  },
  cropButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  cropButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageCropScreen;
