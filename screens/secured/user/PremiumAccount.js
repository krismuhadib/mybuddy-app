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

const PremiumAccount = () => {

  const storeDispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [legalText, setLegaltext] = useState([]);
  const [notifs, setNotifs] = useState(userData.allow_notifs);
  const [displaybutton, setDisplayButton] = useState(true);
  const [isPremium, setIsPremium] = useState(userData.ispremium);


  console.log("isPremium : ",userData, isPremium)
  
  

  const togglePremium = () => {
    setIsPremium(!isPremium);
  };



  const EditUser = async () => {
    if (userData) {
      let userProps = {
        _id: userData._id,
        ispremium: isPremium,
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
        label={i18n.t('premium.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <ScrollView>

        <View style={{ paddingTop: 10, marginLeft:10, marginRight:10 }}>
          <View style={{ flexDirection: "column", padding: 10, alignContent: "center", justifyContent: "space-between" }}>
            <View style={{ paddingTop: 0, padding: 0 }}>
              <SwitchComponent
                label={i18n.t('premium.activate')}
                onValueChange={() => togglePremium()}
                value={isPremium}
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

export default PremiumAccount;


