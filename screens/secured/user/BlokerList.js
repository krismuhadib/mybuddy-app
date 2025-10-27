import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import ListSeparator from '../../../components/elements/ListSeparator';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';
import { RemoveItemId } from '../../../utils/helpers';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../../redux/slices/animalSlice';

import config from '../../../config';
var noImg = require('../../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const BlokerList = ({ route }) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const storeDispatch = useDispatch();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const { from } = route.params.from;

  //console.log("SpeciesScreen from", from)

  const [speciesList, setSpeciesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [typeOf, setTypeOf] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées

  const [likerList, setLikerList] = useState([]);
  const [blokerList, setBlokerList] = useState([]);


  console.log("BlokerList")


  useEffect(() => {
    getAllBlokers();
  }, [isFetching]);


  const reloadList = () => {
    setIsFetching(true);
    getAllBlokers();
  };

  const getAllBlokers = async () => {
    await fetch(config.uri+'animals/getallblokers', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              //'x-access-token' : this.state.userToken,
            },
            body: JSON.stringify ({
              user_id : userData._id,
              animal_id : animalData._id,
             // token: this.props.token.token, 
            })
          })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true ) {
              setBlokerList(res.postList);
              setFilteredData(res.postList);
              setIsFetching(false);

            }
            else {
              // console.log('ca marche PASSSS RES ?',res.success, res.key);
              alert('Les infos User/Password sont mal remplies');
            }
          });

  };

  const deblockUser = async (item) => {

    console.log("deblockUser")

    await fetch(config.uri+'animals/deletebloker', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            //user_id_animal: this.state.item.animal_id._id,
            animal_id: animalData._id,
            user_id : userData._id,
            bloker_id : item._id,
            blokedanimal: item._id,
            blokeduser: item.user_id._id,
          
          })
        })
        .then((response) => response.json())
        .then((res) => { 
          if (res.success === true) {
            console.log("deblockUser res", res)
            storeDispatch(SaveAnimal(res.animalDoc));
            getAllBlokers();
           
          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert('Les infos User/Password sont mal remplies');
          }
        });
  };

  const goToProfile = (item) => {

    navigation.navigate('AnimalDetails', {
      from: "FriendList",
      item: item,
      userToken: userData._id,

    })


  };

  const renderItem = ({ item, i }) => (
    <View key={i}>
      <View style={BDiaryStyles.card}>
        <View style={{ height: 110, justifyContent: 'center' }}>

          <View style={{ flexDirection: 'row', borderWidth: 0 }}>
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

                {(animalData._id) && 

                <TouchableOpacity
                onPress={()=> deblockUser(item)}
                
                >
                  <View style={{ padding:5, borderWidth:1, borderRadius:22, alignContent:"center", justifyContent:"center", alignItems:"center"}}>
                    <Text style={{paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 12, color: Colors.black, fontStyle: "normal" }}>{i18n.t('bloker.unblock')}</Text>


                  </View>




                </TouchableOpacity>
                }
                {/* <BuddyButton
                  item={item}
                  reloadList={() => getAllFriends()}
                /> */}

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


    const filteredData = blokerList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredData);

  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(blokerList);
    } else {
      filterData(text);
    }
  };


  return (

    <View style={[BDiaryStyles.container, { backgroundColor: Colors.white }]}>

      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="add"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('bloker.title')}
        navigationName="User"
        navigationFrom="User"
        goBack= {true}
      //  navigationNameR="WelcomeUser"
      // navigationFromR="User"
      />

      <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={blokerList}
        />
      </View>

      {(blokerList) &&
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => reloadList()}
          refreshing={isFetching}
          keyExtractor={(item, i) => item._id}
          // extraData={this.state}
          data={filteredData}
          ItemSeparatorComponent={ListSeparator}
          renderItem={renderItem}
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
    backgroundColor: Colors.white,
    //marginBottom: 25,
    // borderBottomWidth: 1,
    //borderColor: "#ccc"
  },


});

export default BlokerList;


