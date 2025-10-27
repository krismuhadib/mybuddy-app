import React from 'react';
import {SafeAreaView, Animated, PanResponder,ImageBackground, Platform, Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';

//import Colors from '../constants/Colors';
import { Text, View } from './Themed';

// Icons
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/fontawesome';
import { Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'
import i18n from '../utils/i18n';
import { connect } from 'react-redux'; 


import moment from "moment";
import 'moment/locale/fr';

import Carousel from 'react-native-snap-carousel';


// Screen Sizes
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
import Colors from './Colors'; 
const markers = [];


// Imports
var config = require('../config.tsx');
var logo_small = require('../assets/images/logo_small.png');
var noImg = require('../assets/images/logo_avatar.png');



class CarousselAvatar extends React.Component {
  
  constructor (props) {
    super(props)
    let width = Dimensions.get('window')
    
    this.state = {
      animal_id : this.props.animal_id,
      carouselItems: [],
      newcarousel : [],
      count:"",
      markers2:[],
      noImg: noImg,
     // avatars: this.props.animal.avatars,
    }; 
    //console.log("Carousel USER ID",this.state.animal_id);
 //   this.getAnimalDoc();
  };



 
 

  

  componentDidMount() {
    
    setTimeout(() => {
      this.getUserImages();
      }, 10);



  //  this.getAnimalDoc();
 


  };

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {

    if (this.props.animal._id !== prevProps.animal._id) {
      setTimeout(() => {
        this.getUserImages();
        }, 0);
  
    }
    }

   


  
  // Get all UserImages from carousel db
  getUserImages = () => {
    //console.log("Carousel USER ID",this.state.user_id,);
    fetch(config.uri + 'carousel/getuserimages', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          animal_id: this.state.animal_id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
          
          
         //  console.log("CArousssselllAAAAlll",res);

            this.setState({
              modalVisible: false,
              carouselItems: res.userImageList.reverse(),
             
            });
            
          //console.log ("CAROUSEL AVATAR / -> postList",this.state.carouselItems);
          } else {
            console.log('ca marche PASSSS RES ?', res.success);
            alert('Probleme avec backend getuserdatas');
          }
      });

};


    _renderItem({item}){
      
      return (
        <View style={{
            backgroundColor: Colors.white,
            borderRadius: 0,
            height: ScreenHeight /2,
            //padding: 50,
           // marginLeft: 25,
           // marginRight: 25, 
            }}>
              <Image
              source = {{ uri: config.linkserver + item.animal_id +'/images/avatar/' + item.name  +'.jpg' }}
              style={styles.image}
              /> 
         
        </View>

      )
  };


  
 
    
    
    render () {
     const markerss = this.state.carouselItems;
   //  console.log("CAroussssellllll",this.state.carouselItems);


      //console.log("Caroussel Avvatr render", markers)
      return (
        
      <SafeAreaView style={{flex: 1, backgroundColor:'#FFF', paddingTop: 50, }}>
        <View style={{ flex:1 }}>
        {(!this.state.carouselItems[0]) &&
        <View style={{width:ScreenWidth,alignItems:"center", alignContent:"center", justifyContent: 'center', height:410}}>
              <Image source={this.state.noImg}  style={[styles.avatar,{ height:200, width: 200, alignItems:"center", justifyContent:"center", alignSelf:"center"}]} />
            </View>
            }

         {(this.props.animal.avatars) &&
         <Carousel
         ref={(c) => { this._carousel = c; }}
          layout={"default"}
         // ref={ref => this.carousel = ref}
          data={markerss}
          sliderWidth={ScreenWidth}
          itemWidth={ScreenWidth}
         // tutu = {this.state.animal_id}
          renderItem= { this._renderItem}
          onSnapToItem = { index => this.setState({activeIndex:index}) } />
        }
    </View>
  </SafeAreaView>
);
  

}
    
};


const styles = StyleSheet.create({
    
    headeralign: {
        ...Platform.select({
          ios: {
            top : ScreenHeight / 16.4,
          },
          android: {
            top : (ScreenHeight / 10)/1.8,
          },
        }),
      },
      
      headerheight: {
        ...Platform.select({
          ios: {
          height : ScreenHeight / 9,
          },
          android: {
            height :  ScreenHeight / 10,
          },
        }),
        //top:ScreenHeight - 100,
      },

      image : {
        borderWidth:0,
        width:ScreenWidth,
        height:ScreenHeight/2,
       // borderRadius:10,
        overflow:'hidden',
        justifyContent:'flex-end',
        
      },
      avatar: {
        borderWidth:0,
alignContent:'center',
justifyContent:'center',
width: 200,
height:200,
resizeMode: "cover",
       
        borderRadius:0,
      },

      

});
const mapStateToProps = state => ({
  token: state.token,
  Userdocs: state.Userdoc,
  user: state.user.Userdoc,
  Animaldoc: state.Animaldoc,
  animal: state.animal.Animaldoc,
});

const mapDispatchToProps = dispatch => ({
  doAnimalDoc: () => dispatch(doAnimalDoc()),
  removeUserToken: () => dispatch(removeUserToken()),
  updateUserDoc: () => dispatch(updateUserDoc()),
  updateAnimalDoc: () => dispatch(updateAnimalDoc()),
  removeUserDoc: () => dispatch(removeUserDoc())
});

export default connect(mapStateToProps, mapDispatchToProps)(CarousselAvatar);
    