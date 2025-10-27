import React from 'react';
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import i18n from '@/localization/i18n'; // idem
import config from '@/constants/config'; // idem

const images = {
  1: require("../../../assets/images/pin_health.png"),
  2: require("../../../assets/images/pin_store.png"),
  3: require("../../../assets/images/pin_service.png"),
  4: require("../../../assets/images/pin_outdoor.png"),
};

const DisplayMarker = ({
  locationmarker,
  type,
  cord1,
  cord2,
  navigation,
  toggleLike,
  toggleUnLike,
  markerSignalment,
  GetDistanceBetweenTwoPoints,
  MarkerDate,
  userData,
}) => {
  const imgUri = images[type] || images[1]; // fallback

  return (
    <Marker
      coordinate={{
        longitude: Number(locationmarker.longitude),
        latitude: Number(locationmarker.latitude),
      }}
      title={locationmarker.title}
      description={locationmarker.body}
    >
      <Image source={imgUri} style={{ height: 42, width: 30 }} />
      <Callout tooltip>
        <View>
          <View style={styles.bubble}>
            <View style={{ paddingBottom: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.markertitle}>{locationmarker.title}</Text>
                  <Text style={[styles.markeradress, { top: -5, fontSize: 10 }]}>
                    {GetDistanceBetweenTwoPoints(cord1, cord2)} Km
                  </Text>
                  <Text style={styles.markeradress}>{locationmarker.formatted}</Text>
                </View>
                <Image source={imgUri} style={{ height: 30, width: 22 }} />
              </View>

              <Text style={styles.markerdescription}>{locationmarker.body}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text>{MarkerDate(locationmarker.ldate)}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: Colors.greyL }}>
                  {i18n.t('Page.Author')} :
                </Text>
                <CalloutSubview
                  onPress={() => navigation.navigate('AnimalDetailsMap', {
                    navigateTo: "MapScreenMarker",
                    item: locationmarker,
                    fromWho: "SearchScreenMap",
                    userToken: userData._id,
                    item_user: locationmarker.animal_id,
                    item_animal: locationmarker.animal_id,
                    friends: locationmarker.animal_id?.friends,
                  })}
                >
                  <TouchableOpacity style={[styles.avatarPlaceholder, { top: -10 }]}>
                    <Image
                      source={{
                        uri: `${config.linkserver}${locationmarker.animal_id?._id}/images/avatar/small/${locationmarker.animal_id?._id}.jpg`,
                      }}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>
                </CalloutSubview>
              </View>
            </View>

            <View style={{ flexDirection: "row", padding: 5, justifyContent: "space-between" }}>
              {/* Dislike */}
              <View style={{ flexDirection: "column" }}>
                <CalloutSubview onPress={() => toggleUnLike(locationmarker)}>
                  <TouchableOpacity>
                    <AntDesign
                      name="dislike2"
                      size={24}
                      color={locationmarker.markerunlikes.length > 0 ? Colors.red : Colors.greyL}
                    />
                  </TouchableOpacity>
                </CalloutSubview>
                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>
                  {locationmarker.markerunlikes.length}
                </Text>
              </View>

              {/* Signalement */}
              <View style={{ flexDirection: "column" }}>
                <CalloutSubview onPress={() => markerSignalment(locationmarker)}>
                  <TouchableOpacity>
                    <Ionicons name="alert-circle-outline" size={30} color={Colors.greyL} />
                  </TouchableOpacity>
                </CalloutSubview>
              </View>

              {/* Like */}
              <View style={{ flexDirection: "column" }}>
                <CalloutSubview onPress={() => toggleLike(locationmarker)}>
                  <TouchableOpacity>
                    <AntDesign
                      name="like2"
                      size={24}
                      color={locationmarker.markerlikes.length > 0 ? Colors.greenBuddy : Colors.greyL}
                    />
                  </TouchableOpacity>
                </CalloutSubview>
                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>
                  {locationmarker.markerlikes.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.arrowborder} />
          <View style={styles.arrow} />
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pin: {
        height: 50,
        width: 50
    },
    map: {
        width: '100%',
        height: '100%',
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#ccc',
        opacity: 0.9,
        borderWidth: 0,
        alignSelf: 'center',
        marginTop: -32,

    },
    arrowborder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        opacity: 1,
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    bubble: {
        flexDirection: "column",
        alignSelf: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 6,
        borderColor: "#ccc",
        borderWidth: 0.5,
        padding: 10,
        width: 250,
        height:250,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,

    },
    markertitle: {
        borderWidth: 0,
        maxWidth: 200,
        color: Colors.greyH,
        fontSize: 16,
        textTransform: 'capitalize',
        fontWeight: "bold",
        marginBottom: 5,
    },
    markerdescription: {
        maxWidth: 200,
        color: Colors.greyM,
        fontSize: 14,
        marginBottom: 5,
    },
    markeradress: {
        maxWidth: 200,
        color: Colors.greyM,
        fontSize: 12,
        fontStyle: "italic",
        marginBottom: 5,
    },
    avatar: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 0,
        borderColor: 'red',
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DisplayMarker;