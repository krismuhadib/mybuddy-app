import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import ButtonModal from '../../../components/elements/ButtonModal';
import { AuthContext } from '../../../contexts/AuthContext';
import ModalWarning from '../modals/ModalWarning';

import config from '../../../config';

const UserSettingsScreen = () => {

  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [modalWarning, setModalWarning] = useState(false);
  const [postItem, setPostItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut } = useContext(AuthContext);


  console.log("UserSettings")


  const goToChangeUserInfos = () => {
    navigation.navigate('ChangeUserInfosScreen');
  };

  const goToChangePwd = () => {
    navigation.navigate('ChangePwdScreen');
  };

  const goToChangeEmail = () => {
    navigation.navigate('ChangeEmailScreen');
  };

  const goToDeleteAccount = () => {
    // Open Delete accoiunt Modal
    openWarningModal();
    //navigation.navigate('DeleteAccountScreen');
  };

  const goToPremiumAccount = () => {
    navigation.navigate('PremiumAccountScreen');
  };

  const openWarningModal = (item) => {
    setPostItem(item);
    setModalWarning(true);

  };

  const closeModal = () => {
    setModalWarning(false);
  };

  const getUserMarkers = async () => {
    setIsFetching(true);
    fetch(config.uri + 'markers/getusermarkers', {
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


  return (
    <View style={[BDiaryStyles.container, { backgroundColor: Colors.white }]}>

      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="add"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('userSetting.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      //  navigationNameR="WelcomeUser"
      // navigationFromR="User"
      />

      <ScrollView>

        <ButtonModal
          label={i18n.t('userSetting.accountInformations')}
          icon="account-details"
          library="MaterialCommunityIcons"
          onPress={() => goToChangeUserInfos()}
          display="flex"
        />

        <ButtonModal
          label={i18n.t('userSetting.changeEmail')}
          icon="alternate-email"
          library="MaterialIcons"
          onPress={() => goToChangeEmail()}
          display="flex"
        />
        <ButtonModal
          label={i18n.t('userSetting.changePwd')}
          icon="password"
          library="MaterialIcons"
          onPress={() => goToChangePwd()}
          display="flex"
        />
        <ButtonModal
          label={i18n.t('userSetting.isPremium')}
          icon="account-cash-outline"
          library="MaterialCommunityIcons"
          onPress={() => goToPremiumAccount()}
          display="flex"
        />
        <ButtonModal
          label={i18n.t('userSetting.deleteAccount')}
          icon="user-delete"
          library="AntDesign"
          onPress={() => goToDeleteAccount()}
          display="flex"
        />

      </ScrollView>

      <ModalWarning
        isTrigger={0}
        postnumerselected={0}
        //getAllPost={getAllPost}
        animationType="fade"
        item={postItem}
        getUserMarkers={getUserMarkers}
        //post_animal_id={postItem._id}
        userToken={userData._id}
        animal_id={animalData._id}
        modalVisible={modalWarning}
        navigation={navigation}
        navigateToModal="User"
        signOut={signOut}
        closeModal={closeModal}
      />

    </View>
  );
};


const styles = StyleSheet.create({

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  card: {
    backgroundColor: Colors.white,
    //marginBottom: 25,
    // borderBottomWidth: 1,
    //borderColor: "#ccc"
  },


});

export default UserSettingsScreen;


