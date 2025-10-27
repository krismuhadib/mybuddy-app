import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../redux/slices/animalSlice';
import { i18n } from "../../constants/Localization";
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import MyFonctions from '../MyFonctions';
const config = require('../../config');


const BuddyButton = ({ reloadList, item, friendsNumber }) => {

  const storeDispatch = useDispatch();

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [buttondisplay, setButtondisplay] = useState(true);
  const [friendsCount, setFriendsCount] = useState(0);

  const getUserAnimalDatas = async () => {

    fetch(config.uri + 'animals/getdatasfromanimalid', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          storeDispatch(SaveAnimal(res.animaldoc));
          reloadList();
          friendsNumber;
          
        } else {
          console.log('PRB getUserAnimalDatas');
        }
      });

  };

  const FriendsButtonDisplay = (item, i) => {
    const AppButton = ({ onPress, title, iconame, bgcolor, txtcolor }) => (
      <TouchableOpacity onPress={onPress}
        style={[styles.appButtonContainer, { flexDirection: 'row', backgroundColor: bgcolor }]}>
        <Ionicons style={{ paddingRight: 0 }}
          color={Colors.red}
          name={iconame} size={20}
        />
        <Text style={{
          fontSize: 9,
          color: txtcolor,
          fontWeight: "bold",
          alignSelf: "center",
          textTransform: "uppercase"
        }}>{title}</Text>
      </TouchableOpacity>
    );

    if (buttondisplay === true && animalData.friends) {
      if (animalData.friends.includes(item._id) === false) {
        //console.log("il sont copains", this.props.animal.friends, this.state.item.user_id._id);
        return (
          <View style={{ borderWidth: 0 }}>
            <View>
              <AppButton
                txtcolor={Colors.white}
                bgcolor={Colors.black}
                // iconame="ios-add-circle-outline"
                title={i18n.t('addComment.addFollower')}
                onPress={() => toggleFriends(item)} />
            </View>
          </View>);
      };

      if (animalData.friends.includes(item._id) === true) {
        //console.log("il ne sont pas copains");
        return (
          <View style={{ borderWidth: 0 }}>
            <View>
              <AppButton
                txtcolor={Colors.black}
                bgcolor={Colors.white}
                //iconame="ios-close-circle-outline"
                title={i18n.t('addComment.removeFollower')}
                onPress={() => ButtonRemoveFriends(item)} />
            </View>
          </View>
        )
      }
    };
  };

  const toggleFriends = async (item) => {
    // Envoi du tableau array des favorites dans le backend pour un save mongo
    await fetch(config.uri + 'animals/addfriend', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_item_id: item._id,
        animal_id: animalData._id,
        friend_id: item._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          getUserAnimalDatas();
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          
        }
      });

  };

  const ButtonRemoveFriends = async (item) => {
    await fetch(config.uri + 'animals/deletefriend', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        user_id: userData._id,
        friend_id: item._id,
        animal_item_id: item._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          getUserAnimalDatas();
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Les infos User/Password sont mal remplies');
        }
      });

  };


  return (
    <View style={{}}>
      {(animalData._id !== item._id) &&
        <View style={{ justifyContent: "flex-start", top: 0, alignContent: 'flex-start', alignItems: "flex-start", paddingRight: 10, borderWidth: 0, }}>
          {FriendsButtonDisplay(item)}
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({

  appButtonContainer: {
    minWidth: 70,
    height: 30,
    borderWidth: 1,
    borderColor: Colors.greyH,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: 'center',
  },
  appButtonTextWhite: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  appButtonText: {
    fontSize: 9,
    color: Colors.black,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
});


export default BuddyButton