import React from 'react';
import { Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";


const AnimalConnectDetails = ({ item }) => {

  return (
    <>
        {/* {(this.state.connect === "true") && 
          <View style={{flex:1, flexDirection:"row", margin:0, marginLeft:10,paddingTop:0}}>
            <View style={{ borderWidth:0, margin:0, paddingLeft:5, paddingTop:10}}>
              <Text style={{fontWeight:"bold", fontSize:28, textTransform:"capitalize", }}>{this.state.name}</Text>
            </View>
            
            <View style={{paddingLeft:5, borderWidth:0,paddingBottom:0, paddingTop:10, alignContent:"flex-start", alignItems:"flex-start", justifyContent:"flex-start",}}>
              <View style={{width:10, height:10, paddingTop:0, backgroundColor:Colors.green, borderRadius:5}}></View>
            </View>
          </View>
          }

            {(this.state.connect === "false") &&
            <View style={{ flex: 1, flexDirection: "row", margin: 0, paddingLeft: 10, paddingTop: 0 }}>

              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", alignContent: "center", margin: 0, paddingLeft: 5, paddingTop: 10 }}>
                {(item.animal_id.avatars.length === 0) &&
                  <Image source={noImg} style={[styles.avatarPlaceholder]} />
                }
                <Text style={{ paddingLeft: 10, fontWeight: "bold", fontSize: 28, textTransform: "capitalize", }}>{item.animal_id.name} </Text>

              </View>
              <View style={{borderWidth:0, paddingLeft:5, }}>
              <Text style={{fontSize:10, fontStyle:"italic", color:Colors.greyM}}>Connexion {formdate()} </Text>    
            </View>
            </View>
           } */}
            </>
  );
};

export default AnimalConnectDetails