import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; 
import Colors from '../../components/Colors'; 
import * as Localization from 'expo-localization';
import myFonctions from '../../components/MyFonctions';

// Language
import TextLocalized from '../../utils/locales/langs';
import { I18n } from 'i18n-js';
const i18n = new I18n(TextLocalized);
i18n.locale = myFonctions.CleanLocale(Localization.locale)



var config = require('../../config.tsx');



export default class BlokersAppleSwipeableRow extends Component {
  constructor(props: any) {   
    super(props);
    //this.navigate  = props.navigation;
    this.state = {
      
      user_id : this.props.user_id,
      token : this.props.token,
      navigation : this.props.navigation,
    
      isFetching: false,
  
    };

    // Handler
    //this.MonHandler = this.MonHandler.bind(this)
  };

  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText
          ]}
          >
          Archive
        </Animated.Text>
      </RectButton>
    );
  };


  


  renderRightActionEdit = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      this.props.children.props.goToMarkerDetailsScreen.goToMarkerDetailsScreen();
    };

   
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
            
            <Feather  style={{padding: 5}}
          color={Colors.greyH} 
          name="edit" size={25}
        />  
        </RectButton>
      </Animated.View>
    );
  };
  
  
  
  renderRightActionDelete = (text, color, x, progress) => {
   //console.log("renderRightActionDelete23",this.props )
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    
    const pressHandler = () => {
      console.log("this.props.onRefresh.onRefresCCC();",this.props.children.props.onRefresh)
        
      this.ButtonRemoveBlokers(this.props.children);
      this.close();
      // Refresh flatList
      this.props.children.props.onRefresh.onRefresh();

    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
           <Text style={styles.actionText}>{i18n.t('Form.Unblock')}</Text>
          <Feather  style={{padding: 5}}
          color={Colors.white} 
          name="eye" size={20}
        />  
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = progress => (
    <View style={{ width: 100, flexDirection: I18nManager.isRTL? 'row-reverse' : 'row' }}>
      {/* width: 192 originaly */}
      {/* {this.renderRightAction('More', '#C8C7CD', 192, progress)} */}
      {/* {this.renderRightActionEdit('Flag', Colors.greyUL, 128, progress)} */}
      {this.renderRightActionDelete('Delete', Colors.red, 64, progress)}
    </View>
  );
  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    
    this._swipeableRow.close();
  };

  ButtonRemoveBlokers = async (item) => {

    console.log("remove friend button itemAAABBB", item.props.friend_id._id)
    //console.log("click clickclickclick friends", this.props.user._id, this.state.friend);
    // Envoi du tableau array des favorites dans le backend pour un save mongo
    fetch(config.uri+'animals/deletebloker', {
    //fetch('http://localhost:3000/users/favorites', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        //user_id_animal: this.state.item.animal_id._id,
       animal_id: item.props.animal_id,
        user_id : item.props.user_id,
        bloker_id : item.props.friend_id._id,
        animal_item_id : item.props.friend_id._id,
       // post_id: this.state.item.user_id._id, // A verfiier
        //friends: this.props.user._id,
      })
    })
    .then((response) => response.json())
    .then((res) => { 
      if (res.success === true) {

        
        //let favorites = this.state.favorite;
        //var count = item.friends.length;
        //friends[this.props.user._id] = res.friends;
       console.log("backend return res.favoris & favorites", res)
        //var userToken = res.key;
        //var newfavorite = res.favoris;
        //console.log('Ok pour le retour backendbackend friends :',this.state.friends);
      
        // Refreshing ...
        //this.getAnimalDoc();
        this.getAllFriends();
      }
      else {
        console.log('ca marche PASSSS RES ?', res.success, res.userToken);
        alert('Les infos User/Password sont mal remplies');
      }
    });
  }; 

  DeleteMarker = async (item) => {
    //console.log("item",item)
    fetch(config.uri+'markers/deletemarker', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        //   token: this.state.token,
        _id: this.props.children.props.item._id,
       
      })
      })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true ) {
          //var keypassword = res.key;
          //var user = res;
        //  console.log("postId ", res)
          
        }
      else {
        alert(res.message);
        alert('PRB Delete Marker');
      }
    })


  
  };





  render() {
    const { children } = this.props;
   //console.log("MARKER ComonENET parentFlatList",this.props.parentFlatList)
    //console.log("MARKAER APPLEthis.state.tututhis.state.tutu",this.state.tutu)
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        //renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}>
        {children}
      
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
