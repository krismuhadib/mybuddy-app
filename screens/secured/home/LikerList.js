import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import ListSeparator from '../../../components/elements/ListSeparator';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';
import config from '../../../config';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
var noImg = require('../../../assets/images/logo_avatar.png');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const LikerList = ({ route }) => {

  const navigation = useNavigation();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const { from } = route.params.from;
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
    })

  };

  const renderItem = ({ item, i }) => (
    <View key={i}>
      <View style={BDiaryStyles.card}>
        <View style={{ height: 110, justifyContent: 'center' }}>

          <View style={{ flexDirection: 'row' }}>
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
                  reloadList={() => getAllLikers()}
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

<HeaderBuddyLeft 
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={i18n.t('likerList.title')}
            navigationName="User"
            navigationFrom= "User"
            goBack={true}
            />


     <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={likerList}
        />
      </View>

      {(likerList.length == 0) &&
        <EmptyListMessage
          text={i18n.t('Error.NoLikers')}
        />
      }

      {(likerList) &&
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
    backgroundColor: Colors.background,
    //marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },


});

export default LikerList;


