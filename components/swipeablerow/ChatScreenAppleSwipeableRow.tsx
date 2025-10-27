import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; 
import Colors from '../../components/Colors';
// Language
import * as Localization from 'expo-localization';
import myFonctions from '../../components/MyFonctions';

// Language
import TextLocalized from '../../utils/locales/langs';
import { I18n } from 'i18n-js';
const i18n = new I18n(TextLocalized);
i18n.locale = myFonctions.CleanLocale(Localization.locale)



var config = require('../../config.tsx');



export default class ChatScreenAppleSwipeableRow extends Component {
  constructor(props: any) {   
    super(props);
    //this.navigate  = props.navigation;
    this.state = {
      room_id : this.props.room_id,
      user_id : this.props.user_id,
      animal_id : this.props.animal_id,
      token : this.props.token,
      navigation : this.props.navigation,
      navigateTo : this.props.navigateTo,
      item: this.props.item,
    
      isFetching: false,
  
    };

   // console.log(" Caht screenappleswiple constrictor room_id", this.props.children.props.animal_id  )

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
      //console.log("this.propsSENDMASSAGE;",this.props.children.props)
      this.close();
      this.SendMessage(this.props.children)
     
      this.props.children.props.SendMessage.onRefresh();
    };

   
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
            <Text style={styles.actionText}>{text}</Text> 
            <Feather  style={{padding: 5}}
          color={Colors.white} 
          name="eye" size={25}
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
      console.log("this.props.onRefresh.onRefresCCC();", this.props.room_id)
        
      this.deleteChatRoom(this.props.children);
      this.close();
      // Refresh flatList
      this.props.children.props.onRefresh.onRefresh();

    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
          
          <Text style={styles.actionText}>{i18n.t('Form.Delete')}</Text> 
          <Feather  style={{padding: 5}}
          color={Colors.white} 
          name="trash" size={20}
        />  
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = progress => (
    <View style={{ width: 100, flexDirection: I18nManager.isRTL? 'row-reverse' : 'row' }}>
      {/* width: 192 originaly */}
     {/* {this.renderRightAction('More', '#C8C7CD', 192, progress)} */}
    {/* {this.renderRightActionEdit('See', Colors.redL, 128, progress)} */}
      {this.renderRightActionDelete('Delete', Colors.red, 64, progress)}
    </View>
  );



  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
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

  SendMessage = (item) => {
    
    console.log("SwipleRow SENDMESSGE ITEM", item.props.navigateTo)

    fetch(config.uri+'animals/getdatas', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken
      },
      body: JSON.stringify ({
        user_id : item.destinary,
       // token: this.props.token.token
      })
    })
      .then ((response) => response.json())
      .then((res) => {
        if (res.success === true ) {
          var animaldoc = res;
          
          this.setState({
            animalDoc: animaldoc,
          });
          //console.log('CHATSCREEN ANIMAL DOC',this.state.animalDoc);
          
          const sendPostData = this.state.animalDoc;

          if (item.props.navigateTo === 'Home') {
            this.props.navigation.navigate('MessageScreenFromH', {
              navigateTo : "Home",
              screen: 'MessageScreenFromH',
              sendPostData: item.props,
              notificationtoken : item.props.user_id.notificationtoken,
              room_id : item.props.animal._id,
              animal_name: item.props.user_name,
              animal_destinary : item.props.animal_destinary,
              otherParam: 'anything you wxxxxxxant here',
              item_message : this.state.item_message
            });

          };

          if (item.props.navigateTo === 'SearchScreenSearch') {
            this.props.navigation.navigate('MessageScreenFromHSearch', {
              navigateTo : "SearchScreenSearch",
              screen: 'MessageScreenFromH',
              sendPostData: sendPostData,
              notificationtoken : item.user_id.notificationtoken,
              room_id : item._id,
              animal_name: item.user_name,
              otherParam: 'anything you wxxxxxxant here',
              item_message : this.state.item_message
            });

          };

          if (item.props.navigateTo === 'SearchScreenMap') {
            this.props.navigation.navigate('MessageScreenFromHSearch', {
              navigateTo : "SearchScreenSearch",
              screen: 'MessageScreenFromH',
              sendPostData: sendPostData,
              notificationtoken : item.user_id.notificationtoken,
              room_id : item._id,
              animal_name: item.user_name,
              otherParam: 'anything you wxxxxxxant here',
              item_message : this.state.item_message
            });

          };

          if (item.props.navigateTo === 'FavoriteScreen') {
            this.props.navigation.navigate('MessageScreenFromHFavorite', {
              navigateTo : "FavoriteScreen",
              screen: 'MessageScreenFromH',
              sendPostData: sendPostData,
              notificationtoken : item.user_id.notificationtoken,
              room_id : item._id,
              animal_name: item.user_name,
              otherParam: 'anything you wxxxxxxant here',
              item_message : this.state.item_message
            });

          };






          
         
        
        }
        else {
          console.log('ca marche PASSSS RES ?',res.success);
        }
      });
    };

    deleteChatRoom  = async (item) => {
      this.setState({ display: 'none'});
      console.log("deleteAllMessages deleteAllMessagesAAAAA : Item", item.props.SendMessage.props)
      
      fetch(config.uri+'messages/deletanimal', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          user_id : this.props.children.props.item.animal_datas.user_id._id,
          room_id: this.props.children.props.item._id,
          animal_id : this.props.children.props.animal_id,

        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //let favorites = this.state.favorite;
           // var count = item.lovers.length;
            // favorites[this.props.user._id] = res.favoris;
  this.setState({
    display:"none",
  })
  this.props.navigation.navigate('ChatScreenShareMessage',{
    reload:true,
  });          this.setState({
             //   likerdata : res,
             //   count : count,
               // notiflike : res.notifinfo.like,
             //   notiftitle : res.notifinfo.title,
                
                //likers : likers
            });
            //this.props.navigation.navigate('MatchScreen',{
           //   reload:true,
          //  });
            //this.getAnimalDatas();
            //this.getAllLikers();
            
          }
          else {
            alert(i18n.t('Fetch_Error.prbRes'));
          }
        });
    };
  
  
  



  render() {
    const { children } = this.props;
   // console.log("MARKER ComonENET parentFlatList",children)
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
