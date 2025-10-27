import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import ListSeparator from '../../../components/elements/ListSeparator';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import { GetProfile, calculateAge, GetGenreName } from '../../../utils/helpers';

var config = require('../../../config');
var noImg = require('../../../assets/images/logo_avatar.png');

const AnimalProfilesScreen = () => {
  const navigation = useNavigation();
  const storeDispatch = useDispatch();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [animalList, setAnimalList] = useState([]);
  const [animalListCount, setAnimalListCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState([]);
 
 
  const [selected, setSelected] = useState("");
  
  console.log("choose profil AnimalProfilesScreen")


  useEffect(() => {
    getAnimalsList();
  }, [isFetching, userData]);

  const getAnimalsList = async () => {
    if (userData) {
      fetch(config.uri + 'animals/getuseranimals', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken
        },
        body: JSON.stringify({
          user_id: userData._id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setAnimalList(res.postList);
            setAnimalListCount(res.postList.count);
            // If just one profil then goto wall
            if (res.postList.length > 0 && res.postList.length < 2) {
              GoToRoot(res.postList[0]._id)
            }
          }
          else {
            console.log("AnimalProfilesScreen ERROR");
          }
        });
    }
  };

  const GoToRoot = async (item) => {
    const resultAnimal = await Post(ApiRoutes.animalMe, { _id: item });
    if (resultAnimal) {
      storeDispatch(SaveAnimal(resultAnimal.value));
      navigation.navigate('Root');
    }
    else {
      storeDispatch(SaveAnimal());
    }
  };

  const NotifsPoint = () => {
    if (!animalList) {
      return (
        <View style={{ padding: 5, borderWidth: 0, }}>
          <View style={{ top: 0, width: 10, height: 10, backgroundColor: Colors.red, borderRadius: 5 }}></View>
        </View>
      )
    } else {
      return (
        <View style={{ padding: 5, borderWidth: 0, }}>
          <View style={{ top: 0, width: 10, height: 10, backgroundColor: Colors.green, borderRadius: 5 }}></View>
        </View>
      )
    }
  };

  const renderItem = ({ item, i }) => (

    <View key={i}>
      <View style={styles.card}>
        <TouchableOpacity style={{}}
          onPress={() => GoToRoot(item._id)}>
          <View style={{ flexDirection: 'row', paddingBottom: 10, borderWidth: 0, alignContent: "flex-start", alignItems: "center", justifyContent: "flex-start" }}>
            
            <View style={{ alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, top: 0, padding: 10 }}>
              {(item.avatars.length === 0) &&
                <View >
                  <Image source={noImg} style={[styles.avatar, { borderWidth: 1, }]} />
                </View>
              }
              {(item.avatars.length > 0) &&
                <View >
                  <Image
                    source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
                    size='small'
                    style={styles.avatar}
                  />
                </View>}
              {(item.notif_message === true) &&
                <Ionicons style={{ top: -20, paddingRight: 5 }} name="notifications-sharp" size={25} color="red" />
              }
            </View>
            
            {(item) &&
              <View style={{ flexDirection: "column", flex: 1, paddingTop: 10, paddingLeft: 5, alignItems: "flex-start", justifyContent: "center" }}>
                {/* <View style={{justifyContent:'center'}}>
                <Text style={{textTransform: 'capitalize',fontSize:18, fontWeight:"bold"}}>{item.name}{this.NotifsPoint()}</Text>
                </View> */}
                <View style={{ borderWidth: 0, width: "100%", justifyContent: 'center', flexDirection: "row", alignContent: "space-between", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
                  {/* <AntDesign style={{paddingRight:10}} name="right" size={24} color={Colors.greyM}  /> */}
                </View>

                {(item.breed !== "visitor") &&
                  <View style={{ flexDirection: "row", justifyContent: 'flex-end', borderWidth: 0, }}>
                    
                    <View style={{ justifyContent: "flex-start", alignItems: "flex-end", alignContent: "flex-end", marginRight: 0, }}>
                      <Text style={{ paddingRight: 5, textAlign: "right", fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>{GetProfile(item)}</Text>
                    </View>

                    {(item.typeofname) &&
                      <View>
                        <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>{item.typeofname}</Text>
                      </View>
                    }
                    {(item.breedname) &&
                      <View>
                        <Text numberOfLines={1} style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>
                          {item.breedname.length < 20
                            ? `${item.breedname}`
                            : `${item.breedname.substring(0, 20)}...`} </Text>
                      </View>
                    }
                    {(item.genre) &&
                      <View>
                        <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>{GetGenreName(item.genre)}</Text>
                      </View>
                    }
                    {(item.birthday) &&
                      <View>
                        <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>{calculateAge(item.birthday)} {i18n.t('animalProfile.years')}</Text>
                      </View>
                    }
                      
                  </View>
                }

                <View style={{ justifyContent: 'center', paddingTop: 10, }}>
                  <Text style={{ fontSize: 12, marginRight: 10, color: Colors.greyH, fontStyle: "italic" }} numberOfLines={3}>{item.description}{"\n"}</Text>
                </View>

                <View style={{ justifyContent: 'center', paddingTop: 10, borderWidth: 0 }}>

                  <View style={{ flexDirection: "row", alignContent: "space-between", justifyContent: "space-between", alignItems: "flex-end" }}>

                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.greyM, fontStyle: "italic" }}>{item.friends.length} {i18n.t('animalProfile.buddies')}</Text>
                      {(item.followers) &&
                        <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.greyM, paddingLeft: 10, fontStyle: "italic" }}>{item.followers.length} {i18n.t('animalProfile.followers')}</Text>
                      }
                      {(item.private === true) &&
                        <View>
                          <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.red, paddingLeft: 10, fontStyle: "italic" }}>{i18n.t('animalProfile.privateProfil')}</Text>
                        </View>
                      }
                    </View>

                  </View>

                </View>

              </View>
            }

            {/* {(!item.breed && !item.bday && !item.genre) &&
              <View style={{ flexDirection: "column", borderWidth: 0, flex: 1, paddingLeft: 5, alignItems: "flex-start", justifyContent: "center" }}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ textTransform: 'capitalize', fontSize: 18, fontWeight: "bold" }}>{item.name}{NotifsPoint()}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: 'flex-start', marginTop: -30, borderWidth: 0 }}>
                  {(item.typeofname) &&
                    <View>
                      <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 14, color: Colors.greyM, fontStyle: "italic" }}>{item.typeofname} ...</Text>
                    </View>}
                  <Text style={{ paddingRight: 5, textAlign: "right", fontSize: 14, color: Colors.greyM, fontStyle: "italic" }}>{i18n.t('Page.No_Profil')}</Text>
                </View>
              </View>} */}

          </View>
        </TouchableOpacity>
        <View style={{ paddingLeft: 10 }}></View>
      </View>
    </View>
  );

  const filterData = (text) => {
    setSearchText(text);

    if (i18n.locale === 'fr') {
      const filteredData = animalList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    } else {
      const filteredData = animalList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(animalList);
    } else {
      filterData(text);
    }
  };

  const reloadList = () => {
    setIsFetching(true);
  };

  return (

    <View style={BDiaryStyles.container}>

      {/* <SearchInput
      placeholder={i18n.t('species.search')}
      functionProp = {handleSearchChange}
      list= {animalList}
      /> */}


      <View style={{ flex: 1 }}>

        <FlatList
        showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ListSeparator}
          renderItem={renderItem}
          keyExtractor={(item, i) => item._id ? item._id : i.toString()}
          onRefresh={() => reloadList()}
          refreshing={isFetching}
          data={animalList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  card: {
    backgroundColor: '#fff',
   
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
});


export default AnimalProfilesScreen;