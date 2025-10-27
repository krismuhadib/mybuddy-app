import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { i18n } from "../../constants/Localization";
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import MyFonctions from '../MyFonctions';
const config = require('../../config');

const LikeComment = ({ page, getAllAddComments, item }) => {

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [favorite, setFavorite] = useState([]);
  const [count, setCount] = useState(0);

  const sendPushLikesNotification = async (item) => {
    var commentary = item.comment || '';
    var commentary_elliptic = commentary.length > 40 ? commentary.substring(0, 40) + "..." : commentary;
    var isavatar = animalData.avatars.length;

    try {
      const response = await fetch(config.uri + 'notifications/sendlikenotifications', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: item.animal_id._id,
          title: "Notification Like",
          name: animalData.name,
          post_text: commentary_elliptic,
          post_id: item._id,
          notif_message: true,
          sender_id: animalData._id,
          sender_avatar: isavatar,
          language: i18n._locale,
          originname: item.animal_id.name,
          postanimalid: item.animal_id._id,
        }),
      });
      const res = await response.json();
      if (res.success) {
        console.log("Notification envoyée avec succès !");
      } else {
        console.log("Erreur lors de l'envoi de la notification :", res);
      }
    } catch (error) {
      console.error("Erreur fetch notification:", error);
    }
  };

  const toggleLike = async () => {
    if (item) {
      try {
        const response = await fetch(config.uri + 'posts/likes', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            animal_id: animalData._id,
            post_id: item._id,
            favorites: animalData._id,
            likers: animalData._id,
            language: i18n._locale,
          }),
        });

        const res = await response.json();
        if (res.success) {
          // Conditions pour envoyer la notification
          if (
            item.user_id._id !== userData._id &&
            animalData._id !== item.animal_id._id &&
            !item.favorites.includes(animalData._id)
          ) {
            await sendPushLikesNotification(item); // Appel direct
          }
          getAllAddComments();
          setFavorite(res.favoris);
        } else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    } else {
      console.log("PRB ITEM");
    }
  };

  const like = (item, i) => {
    var heartcolor = Colors.greyH;

    var count = item.favorites.length;
    if (count) {
      heartcolor = 'red';
    }
    if (favorite.includes(item.favorites)) {
      heartcolor = 'red';
    }
    return (
      <View key={i}>
        {(animalData) &&
          <View style={{ flexDirection: 'row', borderWidth: 0, width: 50 }}>

            <TouchableOpacity
              onPress={() => toggleLike(item)}
              style={{ backgroundColor: "#FFF" }}
            >
              <Ionicons style={{ padding: 8 }}
                color={heartcolor}
                name={MyFonctions.isFavorite(animalData._id, favorite) ? 'heart-outline' : 'heart-outline'}
                size={30}
              />
            </TouchableOpacity>
            {(item.favorites.length > 0) &&
              <Text style={{ color: Colors.greyH, justifyContent: 'center', fontSize: 12, paddingTop: 30, marginLeft: -10, }}>{count}</Text>
            }
          </View>
        }
      </View>
    );
  };

  return (
    <View style={{}}>
      {(item.user_id.statusaccount === 1 || item.user_id.statusaccount === undefined) &&
        <View style={{ alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end" }}>
          {like(item)}
        </View>}
    </View>
  );
};


export default LikeComment