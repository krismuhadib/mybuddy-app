import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";

import ListSeparator from '../../../components/elements/ListSeparator';

import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';

import config from '../../../config';
var noImg = require('../../../assets/images/logo_avatar.png');

const LikerList = ({ route }) => {

  // User Redux Store Data
  const navigation = useNavigation();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const { from } = route.params.from;

  //console.log("SpeciesScreen from", from)

  const [speciesList, setSpeciesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [typeOf, setTypeOf] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées

  const [item, setItem] = useState(route.params.item); // Données filtrées
  const [likerList, setLikerList] = useState([]);



  console.log("LikerList")


  useEffect(() => {
    getAllLikers();
  }, [isFetching, typeOf, from,]);


  const reloadList = () => {
    setIsFetching(true);
    getAllLikers();
  };

  const getAllLikers = async () => {
      if (animalData) {
        await fetch(config.uri + 'animals/getalllikers', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            user_id: userData._id,
            animal_id: animalData._id,
            favorites: item.favorites,
            token: userData._id,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              if (searchText === '') {
                setFilteredData(res.postList);
              }
              setLikerList(res.postList);
              setIsFetching(false);
            }
            else {
              // console.log('ca marche PASSSS RES ?',res.success, res.key);
              alert('Les infos User/Password sont mal remplies');
            }
          });
      } else {
        console.log('getuserdatas / PRB USERTOKEN  ?');
      }
    
  };

 const goToProfile = (item) => {

  navigation.navigate('AnimalDetails', {
    from: "Likers",
    item: item,
    userToken: userData._id,

  })


 };

  

  const renderItem = ({ item, i }) => (
    <View key={i}>
      <View style={styles.card}>
        <View style={{ height: 110, justifyContent: 'center' }}>
          
          <View style={{ flexDirection: 'row', backgroundColor: "#fff", borderWidth: 0 }}>
            <View style={{ borderWidth: 0, justifyContent: 'flex-start', paddingLeft: 10 }}>
              {(item.avatars.length === 0) &&
                <View style={{ borderWidth: 0, justifyContent: 'flex-start', alignContent: 'flex-start', paddingLeft: 0, paddingRight: 0 }}>
                  <TouchableOpacity
                    onPress={() => goToProfile(item)}>
                    <Image source={noImg} style={[styles.avatar, { marginLeft: 0, borderWidth: 1, }]} />

                  </TouchableOpacity>
                </View>
              }
              {(item.avatars.length > 0) &&
                <TouchableOpacity
                  onPress={() => goToProfile(item)}>
                  <View
                  >
                    <Image
                      source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
                      size='small'
                      style={styles.avatar}
                    />
                  </View>
                </TouchableOpacity>
              }
            </View>
            <View style={{ borderWidth: 0, flex: 1, flexDirection: "column", alignItems: "flex-start", justifyContent: "center", paddingLeft: 10, }}>
              <View style={{ alignContent: "flex-start", flexDirection: "row", justifyContent: 'flex-start', }}>
                <View style={{ borderWidth: 0, flex: 1, }}>
                  <Text style={{ textTransform: 'capitalize' }}>{item.name}</Text>
                  {(item.breedname !== "visitor") &&

                  <View style={{ flexDirection: "row", justifyContent: 'flex-start', borderWidth: 0 }}>
                    <View>
                      <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.typeofname}</Text>
                    </View>
                    <View>
                      <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.breedname}</Text>
                    </View>
                    <View>
                      <Text style={{ paddingRight: 5, textAlign: "right", textTransform: "capitalize", fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.genre}</Text>
                    </View>
                    <View>
                      <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'none', fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.age} {i18n.t('Page.Age')}</Text>
                    </View>
                  </View>
                  }
                </View>

                <BuddyButton
                item={item}
                reloadList={()=>getAllLikers()}
                />
        
              </View>
              <View style={{ top: 10, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, marginRight: 20 }}>
                <Text style={{ paddingRight: 20, fontSize: 12, color: Colors.greyM, fontStyle: "italic" }} numberOfLines={3}>{item.description}{"\n"}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const filterData = (text) => {

    setSearchText(text);

   
      const filteredData = likerList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(likerList);
    } else {
      filterData(text);
    }
  };



    return (
      <View style={BDiaryStyles.container}>

        <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, }}>

          <SearchInput
            placeholder={i18n.t('species.search')}
            functionProp={handleSearchChange}
            list={likerList}


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



        {(likerList) &&
          <FlatList
            onRefresh={() => reloadList()}
            refreshing={isFetching}
            keyExtractor={(item, i) => item._id}
            // extraData={this.state}
            data={filteredData}
            ItemSeparatorComponent={ListSeparator}
            renderItem={renderItem}
            // renderItem={({ item }) => (
            //   <TouchableOpacity
            //     style={{ width: ScreenWidth, height: 50, justifyContent: 'center', alignItems: 'center' }}
            //     onPress={() => CreateAnimal(item)}>
            //     <Text style={[BDiaryStyles.h4, { textTransform: "capitalize" }]}>{item.name_fr}</Text>
            //   </TouchableOpacity>
            // )}
          />
        }
      </View>
    );
  };


  const styles = StyleSheet.create({

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
    },

    card: {
      backgroundColor: '#fff',
      //marginBottom: 25,
      borderBottomWidth: 1,
      borderColor: "#ccc"
    },


  });

  export default LikerList;


