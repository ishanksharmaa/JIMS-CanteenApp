import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom Toast Component
const CustomToast = {
  success: ({ text1, text2, props }) => (
    <View style={[styles.toastContainer, { backgroundColor: '#4CAF50' }]}>
      {/* <Image source={require('../../assets/eye-open.png')} style={styles.icon} /> */}
      <Ionicons name="cart" size={24} color={"#eee"} style={styles.icon} />
      <View>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
    </View>
  ),

  error: ({ text1, text2, props }) => (
    <View style={[styles.toastContainer, { backgroundColor: '#FF5733' }]}>
      {/* <Image source={require('../../assets/eye-closed.png')} style={styles.icon} /> */}
      <View>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 13,
    width: '90%',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
    position: 'relative',
    zIndex: 100,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  toastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  toastMessage: {
    fontSize: 14,
    color: '#fff',
  },
});

export default CustomToast;
