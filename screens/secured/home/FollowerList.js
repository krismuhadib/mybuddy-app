import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import ListSeparator from '../../../components/elements/ListSeparator';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';
import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import { RemoveItemId } from '../../../utils/helpers';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';

import config from '../../../config';
var noImg = require('../../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const FollowerListScreen = ({ route }) => {

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
  const [filteredData, setFilteredData] = useState([]); // Données filtrées
  const [item, setItem] = useState(route.params.item); // Données filtrées
  const [likerList, setLikerList] = useState([]);

  console.log("FollowerListScreen")

  useEffect(() => {
    getAllFollowers();
  }, [isFetching, typeOf, from,]);


  const reloadList = () => {
    setIsFetching(true);
    getAllFollowers();
  };


  const getAllFollowers = async () => {
    let postProps = {
      animal_id: animalData._id,
    };

    const res = await Post(ApiRoutes.followerList, postProps);

    if (res.success) {
      if (searchText === '') {
        setFilteredData(res.value);
      }
    
      setLikerList(res.value);
      setIsFetching(false);
      console.log("getAllFollowers", likerList)

    } else {
      alert('Les infos User/Password sont mal remplies');
    }
   
  };

  const goToProfile = (item) => {
    navigation.navigate('AnimalDetails', {
      from: "FriendList",
      item: item,
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

                <BuddyButton
                  item={item}
                  reloadList={() => getAllFollowers()}
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
       // iconNameR="add"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('followerList.title')}
       // navigationName="User"
       // navigationFrom="User"
      //  navigationNameR="WelcomeUser"
      // navigationFromR="User"
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
          text={i18n.t('Error.NoFollowers')}
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




});

export default FollowerListScreen;


