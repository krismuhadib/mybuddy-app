import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;
var config = require("../../config.js");
const noImg = require("../../assets/images/logo_avatar.png");

const CarousselAvatar = (animal) => {
  const imageNames = animal._id.avatars || [];

  return (
    <Carousel
      loop
      autoPlay
      autoPlayInterval={5000} // toutes les 5 secondes
      scrollAnimationDuration={1000} // durée de la transition = 1 seconde
      width={ScreenWidth}
      height={ScreenHeight / 2}
      data={imageNames.length > 0 ? imageNames : ["noImg"]}
      renderItem={({ item }) => (
        <Image
          source={
            item === "noImg"
              ? noImg
              : {
                  uri:
                    config.linkserver +
                    animal._id._id +
                    "/images/avatar/" +
                    item +
                    ".jpg",
                }
          }
          style={styles.image}
          resizeMode="cover"
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: ScreenWidth,
    height: ScreenHeight / 2,
  },
});

export default CarousselAvatar;
