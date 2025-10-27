import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Dimensions, TouchableOpacity, Image, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';
import { i18n } from "../../constants/Localization";
import Colors from '../../constants/Colors';
import { calculateAge, GetGenreName, GetSterilizedName } from '../../utils/helpers';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';

import moment from 'moment';

const config = require('../../config');
const noImg = require('../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const MessageNoPostImage = ({ openShareDialogAsync, gotoPostDetails, openLoadingModal, openImageModal, item, modalVisible, removeMessage }) => {

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [displayDownloadText, setDisplayDownloadText] = useState("none");


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
      {(item.item.image_id && !item.item.video_id) &&
        <View style={{ flex: 1, flexDirection: "row" }}>

          <TouchableOpacity
            onPress={() => openImageModal(config.linkserver + item.item.animal_datas._id + '/images/posts/' + item.item.image_id + '.jpg')}
            style={{ borderWidth: 0, paddingLeft: imagehorizontalLeft, paddingBottom: 5, }}>

            <Image
              source={{
                uri: config.linkserver + item.item.animal_datas._id + '/images/posts/' + item.item.image_id + '.jpg',
              }}
              style={{
                borderRadius: 12,
                borderWidth:2,
                borderColor: Colors.white,
                resizeMode: "cover",
                //resizeMode: "contain",
                //resizeMode:"center",
                width: 250,
                height: 250,

              }}

            />

          </TouchableOpacity>

          {(animalData._id !== item.item.animal_datas._id) &&
            <View style={{ borderWidth: 0, flexDirection: "column" }}>
              <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10, }}>

                <>

                  <Text style={{ display: displayDownloadText, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                  <View style={{ padding: 10 }}>
                    <TouchableOpacity
                      onPress={() => openLoadingModal(config.linkserver + item.item.animal_datas._id + '/images/posts/' + item.item.image_id + '.jpg', item)}
                      style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}>
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

      }
    </>
  );
};

export default MessageNoPostImage