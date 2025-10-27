import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import LegendRowItem from '../../../components/elements/LegendRowItem';
import SignalmentRowItem from '../../../components/elements/SignalmentRowItem';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const SignalmentScreen = (route) => {

  const navigation = useNavigation();
  const params = route.route.params;
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [visible, setVisible] = useState(false);
  const [signaled, setVSignaled] = useState(false);
  const [item, setItem] = useState(params.item);
  const [alreadySignaled, setAlreadySignaled] = useState(false);

  // console.log("SignalmentScreen",item.signalmentemetters.includes(animalData._id))
  //console.log("SignalmentScreen params", params.from)


  useEffect(() => {
    if (item.signalmentemetters.includes(userData._id)) {
      console.log("Already signaled")

      setAlreadySignaled(false);
      setVisible(false)
    } else {
      setAlreadySignaled(false);
      setVisible(true)
    }
  }, []);


  return (
    <View style={BDiaryStyles.container}>
      <ScrollView>
        <View>
          {(visible === true) &&
            <View style={{ borderWidth: 0, flexDirection: "column", }}>
              
              <View style={{ padding: 20, backgroundColor: Colors.white, }}>
                <Text style={[BDiaryStyles.h4, { color: Colors.greyH }]}>{i18n.t('Page.Signalment_Details')}</Text>
              </View>

              <SignalmentRowItem
                from={params.from}
                iconName="user"
                navigation={navigation}
                title={"Page.Sex_Signalment"}
                item={item}
                animal_id={animalData._id}
                signalmentnbr="Sex"
                setAlreadySignaled={setAlreadySignaled}
              />

              <SignalmentRowItem
                from={params.from}
                iconName="notification"
                navigation={navigation}
                title={"Page.Hate_Signalment"}
                item={item}
                animal_id={animalData._id}
                signalmentnbr="hate"
              />

              <SignalmentRowItem
                from={params.from}
                iconName={"enviromento"}
                navigation={navigation}
                title={"Page.Harrasment_Signalment"}
                item={item}
                animal_id={animalData._id}
                signalmentnbr="harrassment"
              />

              <SignalmentRowItem
                from={params.from}
                iconName={"linechart"}
                navigation={navigation}
                title={"Page.Violence_Signalment"}
                item={item}
                animal_id={animalData._id}
                signalmentnbr="violence"
              />

              <SignalmentRowItem
                from={params.from}
                iconName={"file1"}
                navigation={navigation}
                title={"Page.Illegal_Signalment"}
                item={item}
                animal_id={animalData._id}
                signalmentnbr="Illegal"
              />

              <SignalmentRowItem
                from={params.from}
                iconName={"info"}
                navigation={navigation}
                title={"Page.Fake_Signalment"}
                item={item}
                animal_id={animalData._id}
                signalmentnbr="fake"
              />

            </View>

          }

          {(visible === false) &&
            <View>
              {(alreadySignaled === true) &&
                <View style={{ borderWidth: 0, padding: 10, alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                  <Text style={{ textAlign: "center", color: "gray", fontSize: 15, fontWeight: "bold" }}> {i18n.t('Page.Signalment_Send')}</Text>
                </View>
              }

              {(alreadySignaled === false) &&
                <View style={{ marginTop: 20, padding: 10, alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                  <Text style={{ textAlign: "center", color: "gray", fontSize: 15, fontWeight: "bold" }}>{i18n.t('Page.Signalment_AlreadySend')}</Text>
                </View>
              }

            </View>
          }
        </View>

      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({

  colorContainer: {
    borderWidth: 1,
    width: ScreenWidth - 40,
    borderColor: Colors.greyM,
    padding: 5,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
    height: 130,
    backgroundColor: Colors.pastred,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68
  },

});



export default SignalmentScreen;


