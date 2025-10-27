import React, { useEffect, useState } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
var config = require('../../config.js');
const logo_small = require('../../assets/images/logo_small.png');
const noImg = require('../../assets/images/logo_avatar.png');


const CarousselAvatar = (animal) => {

  const [carouselItems, setCarouselItems] = useState([]);
  const [animalID, setAnimalId] = useState(animal._id._id);
  const [autoPlay, setAutoPlay] = useState(true);


  useEffect(() => {
    getAnimalCarousel()
  }, [animalID, animal]);


  // Get all Animal Images from carousel db
  getAnimalCarousel = () => {
    fetch(config.uri + 'carousel/getuserimages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animal._id._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setCarouselItems(res.userImageList.reverse());
          if (res.userImageList.reverse().length < 2) {
            setAutoPlay(false)
          }
        } else {
          alert('Probleme avec backend getuserdatas');
        }
      });
  };


  return (

    <View style={{ flex: 1 }}>

      {(!carouselItems) &&
        <View style={{ width: ScreenWidth, alignItems: "center", alignContent: "center", justifyContent: 'center', height: 410 }}>
          <Image source={noImg} style={[styles.avatar, { height: 200, width: 200, alignItems: "center", justifyContent: "center", alignSelf: "center" }]} />
        </View>
      }

      {(carouselItems) &&
        <Carousel
          loop
          width={ScreenWidth}
          height={ScreenHeight / 2}
          autoPlay={autoPlay}
          data={carouselItems}
          scrollAnimationDuration={1000}
          autoPlayInterval={3000}
     //     onSnapToItem={(index) => console.log('current index:', carouselItems[index])}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: config.linkserver + animal._id._id + '/images/avatar/' + item.name + '.jpg' }}
                style={styles.image}
              />
            </View>
          )}
        />
      }
    </View>
  )
};


const styles = StyleSheet.create({

  image: {
    borderWidth: 0,
    width: ScreenWidth,
    height: ScreenHeight / 2,
    // borderRadius:10,
    overflow: 'hidden',
    justifyContent: 'flex-end',

  },
  avatar: {
    borderWidth: 0,
    alignContent: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    resizeMode: "cover",

    borderRadius: 0,
  },

});


export default CarousselAvatar;
