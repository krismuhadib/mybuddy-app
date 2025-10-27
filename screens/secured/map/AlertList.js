import React, { useEffect, useState, useRef, useCallback, useDeferredValue } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Dimensions, TouchableOpacity, Image, Keyboard, Text, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";

import Colors from '../../../constants/Colors';

import SearchInput from '../../../components/elements/SearchInput';
import { i18n } from "../../../constants/Localization";
import AnimalMarkers from '../../../components/elements/AnimalMarkers';
import { AntDesign, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import ListSeparator from '../../../components/elements/ListSeparator';
import { FormatDate } from '../../../utils/helpers';
import ModalWarning from '../modals/ModalWarning';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';



const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const noImg = require('../../../assets/images/logo_avatar.png');


const AlertListScreen = (route) => {

  const mapRef = useRef(null);
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [loading, setLoading] = useState(false);
  const params = route.route.params;
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState();
  const [markerList, setMarkerList] = useState([]);
  const [markerType, setMarkerType] = useState("");
  const [markerTitle, setMarkerTitle] = useState("");
  const [markerDescription, setMarkerDescription] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);
  const [postItem, setPostItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  console.log("AlertList");


  useEffect(() => {
    getUserAlert();
  }, [params]);

  const reloadList = () => {
    setIsFetching(true);
    getUserAlert();
  };


  const getUserAlert = async () => {
    setIsFetching(true);
    fetch(config.uri + 'alerts/getuseralert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: userData._id,
        animal_id: animalData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var userToken = res.key;
          var postList = res;
          setMarkerList(postList.postList);
          setFilteredData(postList.postList);
          setIsFetching(false);
        } else {
          // console.log('ca marche PASSSS RES ?',res.success, res.key);
          alert('Prb Fetching Markers');
        }
      })
  };

  const filterData = (text) => {
    setSearchText(text);
    const filteredData = markerList.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredData);

  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(markerList);
    } else {
      filterData(text);
    }
  };

  const deleteMarker = async (item) => {
    await fetch(config.uri + 'markers/deletemarker', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: item._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          getUserAlert();
        }
        else {
          alert(res.message);
          alert('PRB Delete Marker');
        }
      })
  };

  const openWarningModal = (item) => {
    setModalWarning(true);
    setPostItem(item);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalWarning(false);
  };

  const goToAlertDetails = (item) => {
    navigation.navigate('AlertDetails', {
      item: item,
      from: "List"
    });
  };


  const renderItem = ({ item, i }) => (
    <View key={i}>
      <View style={BDiaryStyles.card}>
        <View style={{ height: 110, justifyContent: 'center' }}>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, top: 0, padding: 5, paddingRight: 15, }}>
              {/* Avatar */}
              {(item.typeofmarkers === 1) &&
                <View style={styles.avatarPlaceholder}>
                  <Image
                    source={require('../../../assets/images/pin_search.png')}
                    size='small'
                    style={styles.avatar}
                  />
                </View>
              }
              {(item.typeofmarkers === 2) &&
                <View style={styles.avatarPlaceholder}>
                  <Image
                    source={require('../../../assets/images/pin_stolen.png')}
                    size='small'
                    style={styles.avatar}
                  />
                </View>
              }
              {(item.typeofmarkers === 4) &&
                <View style={styles.avatarPlaceholder}>
                  <Image
                    source={require('../../../assets/images/pin_toxic.png')}
                    size='small'
                    style={styles.avatar}
                  />
                </View>
              }
              {(item.typeofmarkers === 3) &&
                <View style={styles.avatarPlaceholder}>
                  <Image
                    source={require('../../../assets/images/pin_injured.png')}
                    size='small'
                    style={styles.avatar}
                  />
                </View>
              }
            </View>

            <TouchableOpacity style={{ borderWidth: 0, flexDirection: "column", flex: 1, marginRight: 10 }}
            onPress={() => goToAlertDetails(item)}>
              <View style={{}}>
                <Text style={{ textTransform: 'capitalize', fontWeight: "bold" }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>{item.formatted} {item.city} {FormatDate(item.cdate)}</Text>
              </View>
              <View>
                <Text style={{ top: 5, fontSize: 14, color: Colors.greyH, fontStyle: "italic" }} numberOfLines={1}>{item.body}{"\n"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={{paddingRight:10,}}
              onPress={() => openWarningModal(item)}
            // onPress={() => deleteMarker(item)}
            >
              <Ionicons
                name="trash"
                size={20}
                color={Colors.greyL}
                style={{ justifyContent: "center" }}>
              </Ionicons>
            </TouchableOpacity>

          </View>
        </View>
      </View>



    </View>
  );

  return (

    <View style={BDiaryStyles.container}>

      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('alertList.title')}
        navigationName="AlertMapScreen"
        navigationFrom="Alert"
        goBack={false}
      />

      <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={markerList}
        />
      </View>

      {(markerList && markerList.length === 0) &&
        <EmptyListMessage
          text={i18n.t('Error.NoAlert')}
        />
      }
      

      {(markerList) &&
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => reloadList()}
          refreshing={isFetching}
          keyExtractor={(item, i) => item._id}
          data={filteredData}
          ItemSeparatorComponent={ListSeparator}
          renderItem={renderItem}
        />
      }

      <ModalWarning
        isTrigger={0}
        postnumerselected={0}
        //getAllPost={getAllPost}
        animationType="fade"
        item={postItem}
        getUserAlert={getUserAlert}
        post_animal_id={postItem._id}
        userToken={userData._id}
        animal_id={animalData._id}
        modalVisible={modalWarning}
        navigation={navigation}
        navigateToModal="Alert"
        closeModal={closeModal}
      />
    </View>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },


  card: {
    paddingLeft: 10, paddingRight: 10,
    backgroundColor: Colors.background,
  },

    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 30,
      borderWidth: 0,
      borderColor: Colors.greyH,
      backgroundColor: '#fff',
      justifyContent: "center",
      alignItems: 'center',
    },
    avatar: {
      width: 35,
      height: 35,
     // borderRadius: 10,
      resizeMode:"contain"
    }

});

export default AlertListScreen;
