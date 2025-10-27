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

const MessageText = ({ removeMessage, item }) => {

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
    var backgroundcolor = "#c5ea7f"
    var bordercolor = "#c5ea7f"
  };

  if (item.item.animal_id._id !== animalData._id) {
    // var imagehorizontalLeft = 0;
    //var imagehorizontalRight = 0;
    horizontalLeft = 0;
    horizontalRight = 0;
    backgroundcolor = "white"
    bordercolor = Colors.greenBuddyL
  };

  return (
    <>


      <View style={{ marginTop: 5, }}>


        {(item.item.animal_datas._id !== animalData._id) &&

          <TouchableOpacity>
            <View style={{ borderRadius: 12, borderWidth: 2, borderColor: bordercolor, backgroundColor: backgroundcolor, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
              <View style={{ flexDirection: "column",  paddingTop: 10, paddingLeft: 10, borderWidth: 0,  }}>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", alignContent: "center" }}>
                  <View>
                    <Image
                      source={{
                        uri: config.linkserver + item.item.postanimalmakerid + '/images/avatar/xsmall/' + item.item.postanimalmakerid + '.jpg',
                      }}
                      style={{
                        justifyContent: "center",
                        //position: "relative",
                        // zIndex: 1,
                        // borderWidth: 1,
                        borderRadius: 15,
                        //borderColor: Colors.red,
                        //resizeMode: "contain",
                        width: 30,
                        height: 30,
                        marginBottom: 5
                      }}
                    />
                  </View>
                  <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 12, textTransform: 'capitalize' }}> {item.item.animal_datas.name}</Text>

                </View>
                <Text style={{ paddingTop: 0 }}>{formdate(item.item)}</Text>
              </View>
              <View style={{  }}>
                <Text style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>{item.item.body}</Text>
              </View>
            </View>
          </TouchableOpacity>
        }


        {(item.item.animal_datas._id === animalData._id) &&
          <TouchableOpacity 
            onLongPress={() => removeMessage(item)} style={{ backgroundColor: backgroundcolor, paddingBottom: 10, borderRadius: 12, borderWidth: 2, borderColor: Colors.white, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
            <View style={{ flexDirection: "column", paddingTop: 10, paddingLeft: 10, borderWidth: 0,  }}>
              <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 12, textTransform: 'capitalize' }}> {item.item.animal_datas.name}</Text>
              <Text style={{ paddingTop: 0 }}>{formdate(item.item)}</Text>
            </View>
            <View style={{ backgroundColor: backgroundcolor }}>
              <Text style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>{item.item.body}</Text>
            </View>
          </TouchableOpacity>
        }
      </View>

    </>
  );
};

export default MessageText