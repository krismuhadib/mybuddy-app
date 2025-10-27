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


const BreedsScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();

  const storeDispatch = useDispatch();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value.value);

  const params = route.route.params;

  const [breedsList, setBreedsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [typeOf, setTypeOf] = useState(route.route.params.typeof);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées


  console.log("etetetetetete")
  useEffect(() => {
    ListBreeds();

  }, [isFetching, params, animalData, typeOf]);

  const reloadList = () => {
    setIsFetching(true);
  };

  const ListBreeds = async () => {

    const res = await Post(ApiRoutes.listBreeds, {
      typeOf: typeOf,
    });

    if (res.success) {
      setBreedsList(RemoveLabel(res.value, "all", i18n.locale));
      setIsFetching(false);
      if (searchText === '') {
        setFilteredData(RemoveLabel(res.value, "all", i18n.locale));
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

      if (params.from === "species") { 

        var userProps = {
          id: animalData._id,
          breed: item._id,
          breedname: name
        };

      } else {
        var userProps = {
          id: params.animal_id,
          breed: item._id,
          breedname: name
        };
      }
    
      // if (iban && iban !== "") userProps.iban = iban;
      // if (avsNumber && avsNumber !== "") userProps.avsNumber = avsNumber;
      // if (code && code !== "") userProps.nationality = code;

      const res = await Post(ApiRoutes.animalEdit, userProps);

      if (res.success) {
        //console.log("SaveBreed", res.value);
        storeDispatch(SaveAnimal(res));
        navigation.push('AnimalProfile');
      } else {
        console.log("Error", res);
        // ShowToast(CheckBackendErrors(res.error));
      }
    }
  };

  return (
    <View style={BDiaryStyles.container}>

       <View style={{ width: ScreenWidth }}>
      <SearchInput
      placeholder={i18n.t('species.search')}
      functionProp = {handleSearchChange}
      list= {breedsList}/>
      </View>

      {(breedsList) &&
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
              onPress={()=>SaveBreed(item)}>
              <Text style={[BDiaryStyles.h4, {textTransform:"capitalize"}]}>{item.name_fr}</Text>
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
};


export default BreedsScreen;


