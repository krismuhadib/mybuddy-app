import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Dimensions, TouchableOpacity, Image, Text, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
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

const MessageVideo = ({ shouldPlay, VideoFormat, openShareDialogAsync, gotoPostDetails, openLoadingVideoModal, openLoadingModal, openImageModal, item, modalVisible, removeMessage }) => {

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
      {(item.item.video_id && item.item.video_id !== null && item.item.body !== "bodyTxt") &&
        <View style={{ borderWidth: 0, flex: 1, flexDirection: "column" }}>
          <View style={{ borderWidth: 0, flex: 1, flexDirection: "row" }}>
            <View style={{ marginLeft: imagehorizontalLeft, marginRight: imagehorizontalRight, }}>
              <Feather name="video" size={22} color={Colors.white} style={{ position: "absolute", paddingLeft: 10, top: VideoFormat - 100, zIndex: 10 }} />

              <Video
                source={{
                  uri: config.linkserver + item.item.postanimalmakerid + '/images/posts/videos/' + item.item.video_id + '.mp4'
                }}
                volume={5}
                isMuted={true}
                style={{
                  justifyContent: "center",
                  resizeMode: "contain",
                  marginBottom: 5,
                  zIndex: 1,
                  borderRadius: 12,
                  width: ScreenWidth - 100,
                  height: 250,
                  borderWidth:2,
                  borderColor:Colors.white
                }}
                //style={[styles.cardVideoPortrait, { width:'100%', zIndex: 0,marginBottom:5,}]}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={shouldPlay}
              />
            </View>

            {(animalData._id !== item.item.animal_datas._id) &&
              <View style={{ borderWidth: 0, flexDirection: "column" }}>
                <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10 }}>
                  <>
                    <Text style={{ display: displayDownloadText, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                    <View style={{ padding: 5 }}>
                      <TouchableOpacity
                        style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                        onPress={() => gotoPostDetails(item.item)}
                      >
                        <Feather
                          name="eye"
                          size={22}
                          color={Colors.white}
                          style={{ borderWidth: 0, padding: 0 }}>
                        </Feather>
                      </TouchableOpacity>
                    </View>

                    <View style={{ padding: 5 }}>
                      <TouchableOpacity
                        style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                        onPress={() => openLoadingVideoModal(config.linkserver + item.item.animal_datas._id + '/images/posts/videos/' + item.item.video_id + '.mp4')}>
                        <MaterialCommunityIcons
                          name="share"
                          size={25}
                          color={Colors.white}
                          style={{ borderWidth: 0, padding: 0 }}>
                        </MaterialCommunityIcons>
                      </TouchableOpacity>
                    </View>
                    <View style={{ padding: 5 }}>
                      <TouchableOpacity
                        style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                        onPress={() => openShareDialogAsync(item.item)}
                      >
                        <Feather
                          name="share"
                          size={22}
                          color={Colors.white}
                          style={{ borderWidth: 0, padding: 0 }}>
                        </Feather>
                      </TouchableOpacity>
                    </View>

                  </>
                </View>
              </View>
            }

          </View>
          <View style={{ zIndex:10, borderWidth: 0, padding: 5, borderRadius: 12, borderColor: Colors.greyM, flexDirection: "column", justifyContent: "space-between", alignContent: "space-between", marginTop: -15, }}>
            <TouchableOpacity
              onPress={() => gotoPostDetails(item.item)}>
              <View style={{ backgroundColor: Colors.greenBuddyL, borderRadius: 12, borderWidth: 2, borderColor: Colors.white, flex: 1, flexDirection: "row", padding: 10, }}>

                {(item.item.post_datas) &&
                  <View>
                    {(item?.item?.post_datas?.[0]?.animal_id?.avatars?.length > 0) &&
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
                      />}

                    {(item?.item?.post_datas?.[0]?.animal_id?.avatars?.length === 0) &&
                      <Image
                        source={require('../../assets/images/logo_avatar.png')}
                        style={{
                          justifyContent: "center",
                          //position: "relative",
                          // zIndex: 1,
                          borderWidth: 1,
                          borderRadius: 15,
                          borderColor: Colors.black,
                          //resizeMode: "contain",
                          width: 30,
                          height: 30,
                          marginBottom: 5
                        }}
                      />}
                  </View>

                }
                <View style={{ flex: 1, paddingRight: 10, paddingLeft: 10, borderWidth: 0 }}>
                  <Text style={{
                    fontStyle: "italic",
                    color: Colors.greyM,
                    alignSelf: 'flex-start',
                    borderWidth: 0
                  }}
                    numberOfLines={3}>
                    {item.item.comment} {"\n"}
                  </Text>

                </View>
              </View>
            </TouchableOpacity>
            <View>
              {(item.item.body === " ... ") &&
                <TouchableOpacity
                  activeOpacity={0.6}
                  onLongPress={() => removeMessage(item)}>
                  <Text style={{ textAlign: "right", }}>{formdate(item.item)}</Text>
                </TouchableOpacity>
              }

            </View>

          </View>

        </View>
      }
    </>
  );
};

export default MessageVideo