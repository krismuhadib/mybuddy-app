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
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
const config = require('../../../config');


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const LegalScreen = () => {

  const storeDispatch = useDispatch();

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [legalText, setLegaltext] = useState([]);
  const [legal, setLegal] = useState(userData.allow_legals);
  const [displaybutton, setDisplayButton] = useState(true);

  useEffect(() => {
    GetLegalsTxt();
  }, [legal]);

  const toggleLegal = () => {
    setLegal(!legal);
  };

  const GetLegalsTxt = () => {
    fetch(config.uri + 'users/gettext', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        language: i18n.locale,
        type: "legals",
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setLegaltext(res);
        }
        else {
          console.log("Prb Legals");
        }
      });

  };

  const EditUser = async () => {
    if (userData) {
      let userProps = {
        id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        allow_legals: legal,
      }
      const res = await Post(ApiRoutes.userEdit, userProps);
      if (res.success) {
        ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
        storeDispatch(SaveUser(res.value));
       // navigation.goBack();
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
        label={i18n.t('legal.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <ScrollView>
        <View style={{ padding: 10, paddingTop: 20, paddingBottom: 20, borderWidth: 0, }}>
          {/* <View>
            <Text style={BDiaryStyles.legalBold}>{legalText.title}</Text>
          </View> */}
          <View style={{ paddingTop: 0 }}>
            <Text style={BDiaryStyles.legalBold}>{legalText.subtitle}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_1}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_1}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_2}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_2}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_3}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_3}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_4}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_4}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_5}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_5}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_6}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_6}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_7}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_7}</Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_8}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={BDiaryStyles.legalRegular}>{legalText.body_8}</Text>
          </View>
        </View>

        <View style={{ paddingTop: 40 }}>
          <View style={{ flexDirection: "column", backgroundColor: "#F4F4F4", borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: Colors.greyL, borderBottomColor: Colors.greyL, padding: 10, alignContent: "center", justifyContent: "space-between" }}>
            <Text style={BDiaryStyles.legalRegular}>{i18n.t('Page.Accept_Legals')} :</Text>
            <View style={{ paddingRight: 20, paddingTop: 0, alignContent: "flex-end", alignItems: "flex-end", padding: 0 }}>
              <SwitchComponent
                label=""
                onValueChange={() => toggleLegal()}
                value={legal}
              />

              {/* <Switch style={{padding:10}}
                trackColor={{true: Colors.red, false: Colors.red}}
                onValueChange={this.SwitchAllowNotifs}
                value={this.state.allow_legals}
              /> */}
            </View>
            <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>

              <View style={{ width: 200, }}>
                <BDButton
                  bgcolor={Colors.greyH}
                  color={Colors.white}
                  display={displaybutton}
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

export default LegalScreen;


