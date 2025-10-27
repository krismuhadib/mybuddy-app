import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, Dimensions, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import SwitchComponent from '../../../components/elements/SwitchComponent';
import { SaveUser } from '../../../redux/slices/userSlice';
import { Post, ApiRoutes } from '../../../services/api'
import { ShowToast } from '../../../services/notification';
import { CheckBackendErrors } from '../../../utils/helpers';
import { useDispatch } from "react-redux";
import BDButton from '../../../components/elements/BDButton';
import { CapitalizeFirstLetter, myLocalisation } from '../../../utils/helpers';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';


const config = require('../../../config');


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const IsNotificationScreen = () => {

  const storeDispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [legalText, setLegaltext] = useState([]);
  const [notifs, setNotifs] = useState(userData.allow_notifs);
  const [displaybutton, setDisplayButton] = useState(true);


  console.log("notifications : ",userData)
  useEffect(() => {
    //fetchLocation();
    console.log("notifs", notifs)


  }, [notifs]);

  const toggleNotifs = () => {
    setNotifs(!notifs);
  };

  // const fetchLocation = async () => {
  //   const position = await myLocalisation();
  //   if (position) {
  //     setLatitude(position.coords.latitude - 1 / 50000 + (Math.random() / 250));
  //     setLongitude(position.coords.longitude - 1 / 50000 + (Math.random() / 250));
  //     console.log("Geolocalisation latitudeqqq",latitude )
  //   }
  // };

  // Save Latitude & longitude to cuttent animal

  // const savePosition = () => {} {
  // };


  const EditUser = async () => {
    if (userData) {
      let userProps = {
        _id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        allow_notifs: notifs,
      }
      const res = await Post(ApiRoutes.userEdit, userProps);
      if (res.success) {
        ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
        storeDispatch(SaveUser(res.value));
        navigation.goBack();
      } else {
        ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
      }

    }
  };

  return (
    <View style={BDiaryStyles.container}>
      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('notifications.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <ScrollView>

        <View style={{ paddingTop: 10, marginLeft:10, marginRight:10 }}>
          <View style={{ flexDirection: "column", padding: 10, alignContent: "center", justifyContent: "space-between" }}>
            <Text style={BDiaryStyles.h4}>{i18n.t('notifications.AllowNotificationTxt')} :</Text>
            <View style={{  padding: 0 }}>
              <SwitchComponent
                label={i18n.t('notifications.activeNotifications')}
                onValueChange={() => toggleNotifs()}
                value={notifs}
              />
            </View>
            <View style={{ flex: 1, paddingTop: 50, alignContent: "center", alignItems: "center", justifyContent: "center" }}>

              <View style={{ width: 200, }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={true}
                  functionProp={EditUser}
                  label={i18n.t('animalProfile.submit')}
                />
              </View>

            </View>

          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default IsNotificationScreen;


