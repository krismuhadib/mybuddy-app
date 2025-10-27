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
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
import { Countries } from '../../../assets/datas/Countries';
import { SaveUser } from '../../../redux/slices/userSlice';
import { ShowToast } from '../../../services/notification';
import { SaveAnimal } from '../../../redux/slices/animalSlice';

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);



const CountryScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();

  const storeDispatch = useDispatch();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  const params = route.route.params;

  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées
  const { specify } = route.route.params;
  const { from } = route.route.params;
  const [code, setCode] = useState(userData ? userData.nationality : '');
  const [countriesList, setCountriesList] = useState([]);

  console.log("Countries")

  useEffect(() => {
    if (Countries && Countries !== undefined) {
      setCountriesList(CountriesArrayToObjects(Countries));
      setFilteredData(CountriesArrayToObjects(Countries));
    }
  }, [from]);

  const filterData = (text) => {
    setSearchText(text);

    if (i18n.locale === 'fr') {
      const filteredData = countriesList.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    } else {
      const filteredData = countriesList.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(countriesList);
    } else {
      filterData(text);
    }
  };

  const SaveCountry = async (item) => {
    if (item !== null) {
      const res = await Post(ApiRoutes.userEdit, {
        _id: userData._id,
        country: item.code
      });

      if (res.success === true) {
        storeDispatch(SaveUser(res.value));
        //ShowToast('success', 'Success', i18n.t('userSetting.userUpdated'));
        navigation.goBack();
      } else {
        ShowToast('error', 'Error');
      }
    } else {
      console.log("Error", res);
    }
  };


  const CountriesArrayToObjects = () => {
    if (Countries) {
      const countriesObject = [];
      for (let i = 0; i < Countries.length; i++) {
        const objet = {
          title: Countries[i][0],
          code: Countries[i][1],
          indicatif: Countries[i][2],
          id: i + 1
        };
        countriesObject.push(objet);
      }
      return countriesObject;
    } else {
      return null
    }
  };


  //console.log("countriesList", countriesList)


  const handleItemSelectCountry = (nameValue, item) => {
    setCode(item.code);
  };

  return (
    <View style={BDiaryStyles.container}>

      <HeaderBuddy
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('countries.title')}
        navigationName="User"
        navigationFrom={"User"}
        goBack={true}
      />

      <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={countriesList} />
      </View>

      {(countriesList) &&
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
              onPress={() => SaveCountry(item)}>
              <Text style={[BDiaryStyles.h4, { textAlign: "center", textTransform: "capitalize" }]}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
};


export default CountryScreen;


