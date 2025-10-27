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
import { myLocalisation } from '../../../utils/helpers';
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';



const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const IsGeoLocalisationScreen = () => {

  const storeDispatch = useDispatch();

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [legalText, setLegaltext] = useState([]);
  const [geoloc, setGeoloc] = useState(userData.allow_geoloc);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");



  const [displaybutton, setDisplayButton] = useState(true);

  useEffect(() => {
    fetchLocation();
   

  }, [geoloc]);

  const toggleGeoloc = () => {
    setGeoloc(!geoloc);
  };

  const fetchLocation = async () => {
    const position = await myLocalisation();
    if (position) {
      setLatitude(position.coords.latitude - 1 / 50000 + (Math.random() / 250));
      setLongitude(position.coords.longitude - 1 / 50000 + (Math.random() / 250));
      console.log("Geolocalisation latitudeqqq",latitude )
   
    }

  };

  // Save Latitude & longitude to cuttent animal

  const EditAnimal = async () => {

    let animalProps = {
      id: animalData._id,
      user_id: userData._id,
    };

  
    if (latitude && latitude !=="") animalProps.latitude = latitude;
    if (longitude && longitude !=="") animalProps.longitude = longitude;


    const res = await Post(ApiRoutes.validate, animalProps);
    if (res.success) {
      
        ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
        storeDispatch(SaveAnimal(res.value));
        navigation.navigate('User', {
          from: "modal"
        });
        
     
      
    } else {
      ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }
  };



  const EditUser = async () => {
   
    
    if (userData) {
      let userProps = {
        _id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        allow_geoloc: geoloc,
      }
      const res = await Post(ApiRoutes.userEdit, userProps);
      if (res.success) {
        EditAnimal();
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
            label={i18n.t('modalSettings.geolocalisation')}
            navigationName="User"
            navigationFrom= "User"
            goBack={true}
            />

      <ScrollView>

        <View style={{ paddingTop: 10, marginLeft:10, marginRight:10 }}>
          <View style={{ flexDirection: "column", padding: 10, alignContent: "center", justifyContent: "space-between", marginBottom:10, }}>
            <Text style={BDiaryStyles.legalRegular}>{i18n.t('Page.AllowGeolocalisationTxt')} :</Text>
            <View style={{ paddingTop: 0, }}>
              <SwitchComponent
                label={i18n.t('modalSettings.activeGeolocalisation')}
                onValueChange={() => toggleGeoloc()}
                value={geoloc}
              />

              {/* <Switch style={{padding:10}}
                trackColor={{true: Colors.red, false: Colors.red}}
                onValueChange={this.SwitchAllowNotifs}
                value={this.state.allow_legals}
              /> */}
            </View>
            <View style={{ flex: 1,paddingTop: 50 , alignContent: "center", alignItems: "center", justifyContent: "center" }}>

              <View style={{ width: 200, }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
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

export default IsGeoLocalisationScreen;


