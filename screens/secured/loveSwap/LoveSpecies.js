import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import { RemoveLabel } from '../../../utils/helpers';
import ListSeparator from '../../../components/elements/ListSeparator';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
import HeaderBuddy from '../../../components/elements/HeaderBuddy';


const LoveSpeciesScreen = ( route ) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const storeDispatch = useDispatch();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const { specify } = route.route.params;
  const { from } = route.route.params;
  //console.log("SpeciesScreen from", from)

  const [speciesList, setSpeciesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [typeOf, setTypeOf] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées

  console.log("LoveSpeciesScreen params", from, specify)

  useEffect(() => {
    ListSpecies();
  }, [isFetching, typeOf]);

  const reloadList = () => {
    setIsFetching(true);
  };

  const ListSpecies = async () => {
    const res = await Post(ApiRoutes.listSpecies);
    if (res.success) {
      setSpeciesList(RemoveLabel(res.value, "All", i18n.locale));
      setIsFetching(false);
      if (searchText === '') {
        setFilteredData(RemoveLabel(res.value, "All", i18n.locale));
      }

    } else {
      ShowToast(CheckBackendErrors(res.error));
    }
  };

  const filterData = (text) => {

    setSearchText(text);

    if (i18n.locale === 'fr') {
      const filteredData = speciesList.filter(item =>
        item.name_fr.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    } else {
      const filteredData = speciesList.filter(item =>
        item.name_en.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(speciesList);
    } else {
      filterData(text);
    }
  };

  const goSetting = () => {
    navigation.navigate("LoveSwapSetting", {
      params: typeOf,
    })
  };

  const EditAnimal = async (item) => {
    // console.log("item", item)

    var name = "";

    if (item !== null) {

      if (i18n.locale === 'fr') {
        name = item.name_fr;
      } else {
        name = item.name_en;
      }

        console.log("Love Swap modify AAnimal", item)

        const res = await Post(ApiRoutes.validate, {
          id: animalData._id,
           user_id: userData._id,
          lovetypeof: item._id,
          lovetypeofname: name,
        });

        if (res.success) {
          //console.log("CreateAnimal", res.value);
          storeDispatch(SaveAnimal(res.value));
        } else {
          console.log("Error", res);
          // ShowToast(CheckBackendErrors(res.error));
        }
        goSetting();


    } else {
      return
    }
 
  };

  // const CreateAnimal = async (item) => {
  //   // console.log("item", item)

  //   var name = "";

  //   if (item !== null) {

  //     if (i18n.locale === 'fr') {
  //       name = item.name_fr;
  //     } else {
  //       name = item.name_en;
  //     }

  //     // No Animal / first connect

  //     if (animalData === undefined || animalData === null || animalData.length === 0 ) {
  //       // No AnimalData
  //       const res = await Post(ApiRoutes.create, {
  //         typeof: item._id,
  //         typeofname: name,
  //         user_id: userData._id,
  //         private: false,
  //       });

  //       if (res.success) {
  //          if (from === "change" ) {
  //           //console.log("CreateAnimal", res.value);
  //           storeDispatch(SaveAnimal(res.value));
  //           navigation.navigate('UserBreeds', {
  //             typeof: item._id,
  //             from: from,
  //             specify: specify
  //           })
  //         } else {
  //           //console.log("CreateAnimal", res.value);
  //           storeDispatch(SaveAnimal(res.value));
  //           navigation.navigate('ModalBreeds', {
  //             typeof: item._id,
  //             from: "species"
  //           })
  //         }

  //       } else {
  //         console.log("Error", res);
  //         ShowToast(CheckBackendErrors(res.error));
  //       }

  //     }

  //     if (animalData !== undefined || animalData !== null ) {

  //       const res = await Post(ApiRoutes.animalEdit, {
  //         id: animalData._id,
  //         typeof: item._id,
  //         typeofname: name,
  //       });

  //       if (res.success) {

  //         if (from === "change" ) {
  //         storeDispatch(SaveAnimal(res.value));
  //         navigation.navigate('UserBreeds', {
  //           typeof: item._id,
  //           from: "change",
  //           specify: specify
  //         })
  //       } 

  //       if (from !== "change" && specify === "Adoption") {
  //         storeDispatch(SaveAnimal(res.value));
  //         navigation.navigate('UserBreeds', {
  //           typeof: item._id,
  //           from: "User",
  //           specify: specify
  //         })
  //       }
        

  //       } else {
  //         console.log("Error", res);
  //         // ShowToast(CheckBackendErrors(res.error));
  //       }

  //     }

  //     // if (animalData && animalData.length && from !== "change") {

  //     //   const res = await Post(ApiRoutes.animalEdit, {
  //     //     id: " animalData.value._id",
  //     //     typeof: item.typeof,
  //     //     typeofname: name,
  //     //   });

  //     //   if (res.success) {
  //     //     //console.log("CreateAnimal", res.value);
  //     //     storeDispatch(SaveAnimal(res.value));
  //     //     navigation.navigate('User', {
  //     //       typeof: item._id,
  //     //       from: "species"
  //     //     })
  //     //   } else {
  //     //     console.log("Error", res);
  //     //     // ShowToast(CheckBackendErrors(res.error));
  //     //   }

  //     // }
  //   } else {
  //     return
  //   }
 
  // };


  return (
    <View style={BDiaryStyles.container}>
      {(animalData && animalData.name) && 
      <HeaderBuddy 
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={i18n.t('species.title')}
            navigationName="LoveSwap"
            navigationFrom= "LoveSwap"
            />
          }
          {(!animalData) && 
          <HeaderBuddy 
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={i18n.t('species.title')}
            navigationName="ModalUserActivity"
            navigationFrom= "User"
            />
          }

      <View style={{ width: ScreenWidth }}>

        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={speciesList}

        />
        {/* <View style={BDiaryStyles.formContainerRow}>
            <Ionicons style={BDiaryStyles.searchIcon} name="search" size={25} color={Colors.greyL} />
            <TextInput
              style={{ flex: 1, textTransform: 'capitalize' }}
              placeholder={i18n.t('species.search')}
              inputContainerStyle='#fff'
              value={searchText}
              onChangeText={handleSearchChange}
            />
          </View> */}

      </View>



      {(speciesList) &&
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => reloadList()}
          refreshing={isFetching}
          keyExtractor={(item, index) => `${index}`}
          // extraData={this.state}
          data={filteredData}
          ItemSeparatorComponent={ListSeparator}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width: ScreenWidth, height: 50, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => EditAnimal(item)}>
              <Text style={[BDiaryStyles.h4, { textTransform: "capitalize" }]}>{item.name_fr}</Text>
            </TouchableOpacity>
          )}
        />
      }
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

export default LoveSpeciesScreen;


