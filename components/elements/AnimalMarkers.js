import React from 'react';
import { Image, Keyboard, Text, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'; import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import MapView, { Marker, Polyline } from 'react-native-maps';
import MyCircleAnimation from './MyCircleAnimation';

const AnimalMarkers = ({ location, keynbr, animalDataId }) => {


    console.log(keynbr)
    
    if (location.typeofname === "dog" || location.typeofname === "chien") {
        return (
            <>
                <Marker
                    key={keynbr}
                    coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
                //onPress={onMarkerPress(location)}
                >

                    <Image source={require('../../assets/images/pin_dog.png')}
                        style={{ height: 50, width: 50 }}
                    />
                    {(location._id === animalDataId) &&
                        <MyCircleAnimation />
                    }
                </Marker>
            </>
        )
    } else if (location.typeofname === "rabbit" || location.typeofname === "lapin") {
        return (
            <>
                <Marker
                    key={keynbr}
                    coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
                //onPress={onMarkerPress(location)}
                >

                    <Image source={require('../../assets/images/pin_rabbit.png')}
                        style={{ height: 50, width: 50 }}
                    />
                    {(location._id === animalDataId) &&
                        <MyCircleAnimation />
                    }
                </Marker>
            </>
        )
    } else if (location.typeofname === "goat" || location.typeofname === "chevre") {
        return (
            <Marker
                key={keynbr}
                coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
            // onPress={this.onMarkerPress(location)}
            >
                <Image source={require('../../assets/images/pin_goat.png')}
                    style={{ height: 50, width: 50 }}
                />
                {(location._id === animalDataId) &&
                    <MyCircleAnimation />
                }
            </Marker>
        )

    } else if (location.typeofname === "cat" || location.typeofname === "chat") {
        return (
            <Marker
                key={keynbr}
                coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
            // onPress={this.onMarkerPress(location)}
            >
                <Image source={require('../../assets/images/pin_goat.png')}
                    style={{ height: 50, width: 50 }}
                />
                {(location._id === animalDataId) &&
                    <MyCircleAnimation />
                }
            </Marker>
        )

    }
    

};

export default AnimalMarkers