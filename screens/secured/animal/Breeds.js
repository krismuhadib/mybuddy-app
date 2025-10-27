import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import { RemoveLabel, GetSpeciesLang } from '../../../utils/helpers';
import ListSeparator from '../../../components/elements/ListSeparator';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const BreedsScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();

  const storeDispatch = useDispatch();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  const params = route.route.params;

  const [breedsList, setBreedsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [typeOf, setTypeOf] = useState(params.typeof);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées
  const { specify } = route.route.params;
  const { from } = route.route.params;
  console.log("BreedsScreen from / specify", from, specify)

  useEffect(() => {
    ListBreeds();

  }, [isFetching, typeOf]);

  const reloadList = () => {
    setIsFetching(true);
  };

  const ListBreeds = async () => {

    let Typeof = animalData.typeof ? animalData.typeof : animalData.value.typeof;

    if (params.from === "User" || params.from === "species") {
      Typeof = Typeof
    } else {
      Typeof = animalData.typeof;
    }

    const res = await Post(ApiRoutes.listBreeds, {
      typeof: params.typeof,
    });
    if (res) {
      if (specify === "Adoption") {
        setBreedsList(RemoveLabel(res, "ss", i18n.locale));
        setIsFetching(false);
        if (searchText === '') {
          setFilteredData(RemoveLabel(res, "ss", i18n.locale));
        }
      } else {
        setBreedsList(RemoveLabel(res, "all", i18n.locale));
        setIsFetching(false);
        if (searchText === '') {
          setFilteredData(RemoveLabel(res, "all", i18n.locale));
        }
      }
    } else {
      ShowToast(CheckBackendErrors(res.error));
    }
  };

  const filterData = (text) => {
    setSearchText(text);

    if (i18n.locale === 'fr') {
      const filteredData = breedsList.filter(item =>
        item.name_fr.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    } else {
      const filteredData = breedsList.filter(item =>
        item.name_en.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(breedsList);
    } else {
      filterData(text);
    }
  };

  const SaveBreed = async (item) => {

    var name = "";
    if (item !== null) {

      if (i18n.locale === 'fr') {
        name = item.name_fr;
      } else {
        name = item.name_en;
      }

      if (from === "species" || from === "User") {

        var userProps = {
          id: animalData.value._id,
          breed: item._id,
          breedname: name,
        };

      } else {
        var userProps = {
          id: animalData._id,
          breed: item._id,
          breedname: name
        };
      }

      // if (iban && iban !== "") userProps.iban = iban;
      // if (avsNumber && avsNumber !== "") userProps.avsNumber = avsNumber;
      // if (code && code !== "") userProps.nationality = code;

      const res = await Post(ApiRoutes.animalEdit, userProps);
      if (res.success) {

        if (from === "species") {
          storeDispatch(SaveAnimal(res.value));
          navigation.navigate('ModalAnimalProfile', {
            from: "breeds",
            specify: specify

          });

        }

        if (from === "change") {
          storeDispatch(SaveAnimal(res.value));
          navigation.navigate('UserAnimalProfile', {
            from: "change",
            specify: specify

          });

        }

        if (from === "User" && specify === "Adoption") {
          storeDispatch(SaveAnimal(res.value));
          navigation.navigate('UserAnimalProfile', {
            from: "User",
            specify: specify,


          });

        }

        if (from === "User" && specify !== "Adoption") {
          storeDispatch(SaveAnimal(res.value));
          navigation.navigate('UserAnimalProfile', {
            from: "User",
            specify: specify,
          });

        }






        //  if (params.from !== "change" && params.from !== "species" && params.from === "User") {
        //   storeDispatch(SaveAnimal(res.value));
        //   navigation.navigate('UserAnimalProfile', {
        //     from: "User"
        //   });
        //  }






      } else {
        console.log("Error", res);
        // ShowToast(CheckBackendErrors(res.error));
      }
    }
  };

  return (
    <View style={BDiaryStyles.container}>
      
      <HeaderBuddy
        // openModal={openModal}
        //iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('breeds.title')}
        navigationName="User"
        navigationFrom={"User"}
        goBack={true}
      />

      <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={breedsList} />
      </View>

      {(breedsList) &&
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => reloadList}
          refreshing={isFetching}
          keyExtractor={(item, index) => `${index}`}
          // extraData={this.state}
          data={filteredData}
          ItemSeparatorComponent={ListSeparator}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width: ScreenWidth, height: 50, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => SaveBreed(item)}>
              <Text style={[BDiaryStyles.h4, { textTransform: "capitalize" }]}>{GetSpeciesLang(item)}</Text>
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
};


export default BreedsScreen;


