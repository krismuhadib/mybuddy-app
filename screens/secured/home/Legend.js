import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import LegendRowItem from '../../../components/elements/LegendRowItem';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import { i18n } from "../../../constants/Localization";

const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const LegendScreen = (route) => {

  const navigation = useNavigation();
  const params = route.route.params;

  return (
    <View style={BDiaryStyles.container}>

      <HeaderBuddyLeft
              // openModal={openModal}
              iconNameL="angle-left"
              //iconNameR="ellipsis-vertical-sharp"
              iconFamilyL="FontAwesome"
              //iconFamilyR="Ionicons"
              label={i18n.t('legends.title')}
              navigationName="User"
              navigationFrom="User"
              goBack={true}
            />
      <ScrollView>
        <LegendRowItem
          iconName="dog"
          navigation={navigation}
          title={"Animal.Dog"}
        />
        <LegendRowItem
          iconName="cat"
          navigation={navigation}
          title={"Animal.Cat"}
        />
        <LegendRowItem
          iconName={"rabbit"}
          navigation={navigation}
          title={"Animal.Rabbit"}
        />

        <LegendRowItem
          iconName={"hamster"}
          navigation={navigation}
          title={"Animal.Hamster"}
        />
        <LegendRowItem
          iconName={"bird"}
          navigation={navigation}
          title={"Animal.Bird"}
        />
        <LegendRowItem
          iconName={"mouse"}
          navigation={navigation}
          title={"Animal.Mouse"}
        />
        <LegendRowItem
          iconName={"ferret"}
          navigation={navigation}
          title={"Animal.Ferret"}
        />

        <LegendRowItem
          iconName={"poisson"}
          navigation={navigation}
          title={"Animal.Fish"}
        />

        <LegendRowItem
          iconName={"horse"}
          navigation={navigation}
          title={"Animal.Horse"}
        />

        <LegendRowItem
          iconName={"vache"}
          navigation={navigation}
          title={"Animal.Cow"}
        />
        <LegendRowItem
          iconName={"taureau"}
          navigation={navigation}
          title={"Animal.Bull"}
        />
        <LegendRowItem
          iconName={"chevre"}
          navigation={navigation}
          title={"Animal.Goat"}
        />
        <LegendRowItem
          iconName={"cochon"}
          navigation={navigation}
          title={"Animal.Pig"}
        />
        <LegendRowItem
          iconName={"mouton"}
          navigation={navigation}
          title={"Animal.Sheep"}
        />
        <LegendRowItem
          iconName={"bug"}
          navigation={navigation}
          title={"Animal.Bug"}
        />
        <LegendRowItem
          iconName={"spider"}
          navigation={navigation}
          title={"Animal.Spider"}
        />
        <LegendRowItem
          iconName={"serpent"}
          navigation={navigation}
          title={"Animal.Snake"}
        />
        <LegendRowItem
          iconName={"tortue"}
          navigation={navigation}
          title={"Animal.Turtle"}
        />
        <LegendRowItem
          iconName={"femelle_off"}
          navigation={navigation}
          title={"Animal.Femelle_Off"}
        />
        <LegendRowItem
          iconName={"femelle_on"}
          navigation={navigation}
          title={"Animal.Femelle_On"}
        />
        <LegendRowItem
          iconName={"male_off"}
          navigation={navigation}
          title={"Animal.Male_Off"}
        />
        <LegendRowItem
          iconName={"male_on"}
          navigation={navigation}
          title={"Animal.Male_On"}
        />
        <LegendRowItem
          iconName={"lof"}
          navigation={navigation}
          title={"Animal.Lof"}
        />
        <LegendRowItem
          iconName={"wantbaby"}
          navigation={navigation}
          title={"Animal.Wantbaby"}
        />
        <LegendRowItem
          iconName={"heart"}
          navigation={navigation}
          title={"Animal.Heart"}
        />
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



export default LegendScreen;


