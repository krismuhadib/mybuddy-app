import React, { useRef, useEffect, useState } from 'react';
import {Image, Alert, Platform, Text, Dimensions, Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const FullScreenAddPost = ({ uri, visible, onClose }) => {

  console.log("FullScreenAddPost", uri)

  const closeWarningModal = () => {
    setModalVisible(false);
    onClose();

  };



  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose} // pour Android
      >
      <View style={styles.container}>

        {/* Bouton de fermeture */}
        <View style={{ zIndex: 10, width: "100%", flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
   
          <View style={{ flex:1, width: ScreenWidth, alignContent: "center", justifyContent: "center", alignItems:"center"  }}>
            <Image source={{ uri: uri }} style={{ borderRadius:12, resizeMode: "contain", width: ScreenWidth -20, height: ScreenHeight -400 }} />
          </View>
        
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  cardImage1: {
    //justifyContent: "center",
    borderWidth: 0,
    resizeMode: "center",
    zIndex: 1,
    marginTop: -100,
    height: ScreenHeight,
    paddingBottom: 1000,
    //objectFit: "fill"
  },

  modalContent: {
    width: '80%',
    marginRight: '10%',
    marginLeft: '10%',
    borderRadius: 12,
    padding: 5,
    //opacity: 1,
    ...Platform.select({
      ios: {
        //position: 'absolute',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
      },
    }),
    backgroundColor: 'white',
  },

  closeButton: {
    padding: 20,
    top: 20,
    backgroundColor: "transparent"
  },

  video: {
    position: "absolute",
    width: '100%',
    height: '100%',
  },
});

export default FullScreenAddPost;