import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { FormatDateToNow } from '../../utils/helpers';
import { GetProfile, calculateAge, GetGenreName } from '../../utils/helpers';
import { i18n } from "../../constants/Localization";

const config = require('../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const RowProfileInfos = ({ item }) => {

    return (

        <View>
            {(item) &&
                <View style={{ flexDirection: "row", alignContent:"flex-start", alignItems:"flex-start", justifyContent:"flex-start"}}>
                    {(item.profile !== "noadoption") &&

                        <View style={{}}>
                            <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize',color: Colors.greyM, }]}>{GetProfile(item)}</Text>
                        </View>
                    }
                    {(item.profile !== 'pros' ) &&

                        <View>
                            <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM,  }]}>{item.typeofname}</Text>
                        </View>
                    }

                     {(item.profile !== "noadoption" && item.profile !== 'pros' && item.breedname !== undefined) &&
                        <View>
                            <Text numberOfLines={1} style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM }]}>
                                {item && item.breedname && item.breedname.length < 10
                                    ? `${item.breedname}`
                                    : `${item.breedname.substring(0, 10)}...`} </Text>
                        </View>}
                    {(item.genre) &&
                        <View>
                            <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM,  }]}>{GetGenreName(item.genre)}</Text>
                        </View>}
                    {(item.birthday) &&
                        <View>
                            <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM,  }]}>{calculateAge(item.birthday)} {i18n.t('Page.Age')}</Text>
                        </View>
                    }

                </View>}
        </View>
    );
};




export default RowProfileInfos