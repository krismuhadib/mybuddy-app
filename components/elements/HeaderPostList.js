import React from 'react';
import { TouchableOpacity, Platform, Dimensions, StyleSheet, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { i18n } from "../../constants/Localization";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import DetailsBarSmall from './DetailsBarSmall';


const config = require('../../config');
var noImg = require('../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const HeaderPostList = ({ updatePostLike, getAllPost, openWarningModal, openPostModal, item, navigate, from }) => {
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);

console.log("HeaderPostList", item)


  return (
    <View style={{ backgroundColor: '#fff', height: 80, justifyContent: 'center', zIndex: -1 }}>
      <View style={{ flexDirection: 'row', backgroundColor: "#fff", }}>
        <View style={{ borderWidth: 0, justifyContent: 'center', padding: 10 }}>
          {(item && item.user_id.statusaccount === 0) &&
            <View style={[styles.avatarPlaceholder]} >
              {(!item.animal_id.avatars[0]) &&
                <Image source={noImg} style={[styles.avatar, { borderWidth: 1 }]} />
              }
              {(item.animal_id.avatars[0]) &&
                <TouchableOpacity style={styles.avatarPlaceholder}
                  onPress={() => navigate('NoUserScreen', {
                    from: "Home",
                    item: item,
                    userToken: userData._id,
                  })}>
                  <Image
                    source={{ uri: config.linkserver + item.animal_id._id + '/images/avatar/small/' + item.animal_id._id + '.jpg' }}
                    size='small'
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              }
            </View>
          }
          {((item.user_id.statusaccount && item.user_id.statusaccount === 1) || item.user_id.statusaccount === undefined) &&
            <View style={[styles.avatarPlaceholder]} >
              {(!item.animal_id.avatars[0]) &&
                <TouchableOpacity style={styles.avatarPlaceholder}
                  onPress={() => navigate('AnimalDetails', {
                    from: "Home",
                    title: item.animal_id.name,
                    item: item,
                    userToken: userData._id,

                  })}>
                  <Image source={noImg} style={[styles.avatar, { borderWidth: 1 }]} />
                </TouchableOpacity>
              }
              {(item.animal_id.avatars[0]) &&
                <TouchableOpacity style={styles.avatarPlaceholder}
                  onPress={() => navigate('AnimalDetails', {
                    from: "Home",
                    item: item,
                    title: item.animal_id.name,
                    userToken: userData._id,
                  })}>
                  <Image
                    source={{ uri: config.linkserver + item.animal_id._id + '/images/avatar/small/' + item.animal_id._id + '.jpg' }}
                    size='small'
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              }
            </View>
          }
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'center', borderWidth: 0, flex: 1, alignItems: 'flex-start' }}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: Colors.black, fontWeight: '600', fontSize: 18 }}>{item.animal_id.name}</Text>
          </View>

          <View style={{ borderWidth: 0 }}>
            <DetailsBarSmall
              postData={item}
              token={userData._id}
            />
          </View>

        </View>
        
        {(from !== "User") && 
        <View style={{ alignContent: "center", justifyContent: "center", paddingRight: 10 }}>
          <TouchableOpacity style={{
            paddingRight: 15,
            alignContent: 'flex-end',
            borderWidth: 0,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
            onPress={() => openPostModal(item)}
          >
            <Feather name="more-horizontal" size={25} color={Colors.greyH} />
          </TouchableOpacity>
        </View>
        }
        {(from === "User") && 
        <View style={{ alignContent: "center", justifyContent: "center", paddingRight: 10 }}>
          <TouchableOpacity style={{
            paddingRight: 15,
            alignContent: 'flex-end',
            borderWidth: 0,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
            onPress={() => openWarningModal()}
          >
            <Feather name="trash" size={25} color={Colors.greyH} />
          </TouchableOpacity>
        </View>
        }


      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({

  bloc_Row: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#ccc',
    //borderWidth: 1,
    borderColor: '#000',
    // height: 40,
    //borderRadius: 26
  },

  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: Colors.greyH,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  }
});


export default HeaderPostList