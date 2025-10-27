import React from 'react';
import { Text, Dimensions, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Entypo } from '@expo/vector-icons';
import datas from '../assets/datas'


const Carroussel = () => {

  const slides = datas.map((index, i) => {

    return (

      <View key={i} style={[styles.child, { alignContent: "center", justifyContent: "center", backgroundColor: "#000" }]}>
        <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
          <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: "#222222", position: "absolute", zIndex: 1, width: 50, height: 50, top: -35, borderWidth: 1, borderColor: Colors.gold, borderRadius: 25, alignItems: "center", alignContent: "center", justifyContent: "center" }}>
              <Entypo name="star" size={24} color="white" />
            </View>
            <View style={{ marginRight: "10%", marginLeft: "10%", width: "80%", borderWidth: 1, borderColor: Colors.greyM, position: "relative", height: 180, backgroundColor: "#222222", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
              <View>
                <Text style={styles.text}>{index.title}</Text>
              </View>
              <View style={{ top: 0, width: "80%", marginLeft: "10%", marginRight: "10%", borderWidth: 1, height: 1, borderColor: Colors.greyM }}></View>
              <View>
                <Text style={styles.subtitle}>{index.description} </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  })

  return (
    <View style={styles.container}>
      <SwiperFlatList autoplay autoplayDelay={5} autoplayLoop={true} index={0} autoplayLoopKeepAnimation={false} showPagination
        paginationStyleItem={{ width: 5, height: 5, borderRadius: 5, top: 16 }}>
        {slides}
      </SwiperFlatList>
    </View>
  );

};
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { height: 250, backgroundColor: "#000" },
  child: { width, height: 250, justifyContent: 'center' },
  text: { padding: 20, fontSize: 25, textAlign: 'center', color: Colors.white },
  subtitle: { padding: 20, fontSize: 14, textAlign: 'left', color: Colors.white },


})

export default Carroussel;