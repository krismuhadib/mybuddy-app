import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Dimensions, TouchableOpacity, Image, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';
import { i18n } from "../../constants/Localization";
import Colors from '../../constants/Colors';
import { calculateAge, GetGenreName, GetSterilizedName } from '../../utils/helpers';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';


import moment from 'moment';

const config = require('../../config');
const noImg = require('../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const MessageNoPostVideo = ({displayDownloadText, videoFormat, shouldPlay, openShareDialogAsync, gotoPostDetails, openLoadingVideoModal, openLoadingModal, openImageModal, item, modalVisible, removeMessage }) => {

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);

  console.log("MessageNoPostVideo");

  const formdate = (item) => {
    const date = moment(item.cdate).fromNow();
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 11, color: Colors.greyM }}>... {date}</Text>
    )
  };


  if (item.item.animal_id._id === animalData._id) {
    var imagehorizontalLeft = 80;
    var imagehorizontalRight = 0;
    var horizontalLeft = 40;
    var horizontalRight = 0;
    var backgroundcolor = "#e5efd5"
    var bordercolor = "#e5efd5"
  };

  if (item.item.animal_id._id !== animalData._id) {
    var imagehorizontalLeft = 0;
    var imagehorizontalRight = 0;
    horizontalLeft = 0;
    horizontalRight = 0;
    backgroundcolor = "#c5ea7f"
    bordercolor = "#c5ea7f"
  };

  return (
    <>
      {(item.item.video_id && !item.item.image_id) &&
        <View>
          <View style={{ flex: 1, marginLeft: imagehorizontalLeft, marginRight: imagehorizontalRight, flexDirection: "row" }}>

            <Feather name="video" size={22} color={Colors.white} style={{ position: "absolute", paddingLeft: 10, bottom: 20, zIndex: 200 }} />

            <Video
              source={{
                uri: config.linkserver + item.item.animal_datas._id + '/images/posts/videos/' + item.item.video_id + '.mp4'
              }}
              volume={5}
              isMuted={true}
              style={{
                // position:"absolute",
                justifyContent: "center",
                resizeMode: "cover",
                marginBottom: 5,
                zIndex: 1,
                borderRadius: 8,
                width: "80%",
                height: videoFormat,
                borderWidth:2,
                borderColor: Colors.white
              }}
              //style={[styles.cardVideoPortrait, { width:'100%', zIndex: 0,marginBottom:5,}]}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={shouldPlay}
            />


            {(animalData._id !== item.item.animal_datas._id) &&
              <View style={{ borderWidth: 0, flexDirection: "column" }}>
                <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10 }}>

                  <>
                    <View style={{ padding: 10 }}>
                      <TouchableOpacity
                        style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                        onPress={() => this.openLoadingVideoModal(config.linkserver + item.item.animal_datas._id + '/images/posts/videos/' + item.item.video_id + '.mp4')}>
                        <Text style={{ display: displayDownloadText, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                        <MaterialCommunityIcons
                          name="share"
                          size={25}
                          color={Colors.white}
                          style={{ borderWidth: 0, padding: 0 }}>
                        </MaterialCommunityIcons>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                      onPress={() => this.openShareDialogAsync(item.item)}
                    >
                      <Feather
                        name="share"
                        size={22}
                        color={Colors.white}
                        style={{ borderWidth: 0, padding: 0 }}>
                      </Feather>
                    </TouchableOpacity>
                  </>
                </View>
              </View>
            }
          </View>

        </View>
      }
    </>
  );
};

export default MessageNoPostVideo