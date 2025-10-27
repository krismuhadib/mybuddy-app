import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    PanResponder,
} from 'react-native';

import { i18n } from "../../constants/Localization";
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const noImg = require('../../assets/images/logo_avatar.png');

const config = require('../../config');


const LoveSwap = ({ setIdMatch, idMatch, setActive, active, setMatchVisible, matchVisible, cards, cardIndex, setCardIndex }) => {

    const navigation = useNavigation();
    const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);

    const userData = useSelector((state) => state.user.value ? state.user.value : null);
    const position = useRef(new Animated.ValueXY()).current;
    const [history, setHistory] = useState([]); // Historique des cartes
    const [likers, setLikers] = useState([]);
    const [count, setCount] = useState(0);
  

    console.log("LoveSwap component");

    const cardIndexRef = useRef(cardIndex);

    useEffect(() => {
        cardIndexRef.current = cardIndex;
    }, [cardIndex]);

//         useEffect(() => {
//              console.log("useeffect")
//  undoSwipe();
           
//             setActive(true);

            
     
//   }, [matchVisible]);


    if (!Array.isArray(cards)) cards = [];

    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
    });

    const likeOpacity = position.x.interpolate({
        inputRange: [0, SWIPE_THRESHOLD],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const nopeOpacity = position.x.interpolate({
        inputRange: [-SWIPE_THRESHOLD, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const nextCardOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp',
    });

    const sendPushMatchNotification = async (item,) => {
       
        console.log("sendPushMatchNotification itsm",item)
    var isavatar = animalData.avatars.length;

    try {
        const response = await fetch(config.uri + 'notifications/sendlikenotifications', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: item,
            title: "Notification Like",
            name: animalData.name,
            notif_message: true,
            sender_id: animalData._id,
            sender_avatar: isavatar,
            language: i18n._locale,
            //originname: item.animal_id.name,
            postanimalid: item,
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

    const forceSwipe = (direction) => {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        if (direction === 'right' && cards[cardIndexRef.current]) {
            console.log("ready to rec likerId : ", cards[cardIndexRef.current]._id);

            fetch(config.uri + 'animals/addlovelikers', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'x-access-token' : this.state.userToken,
                },
                body: JSON.stringify({
                    animal_id: animalData._id,
                    liker_id: cards[cardIndexRef.current]._id,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === true) {

                        console.log("addlovelikers res", res);

                        //let favorites = this.state.favorite;
                        //var count = this.state.newpostList[cardIndex].likers.length;
                        // favorites[this.props.user._id] = res.favoris;

                        setLikers(res.likers);
                        setCount(res.likers.length)

                        // IS IT MATCH ?
                        if (res.ismatch === 1) {
                            console.log("LOVE SWAP RETOUR IS MATCH");
                            setIdMatch(cards[cardIndexRef.current]._id);

                            
                            setActive(true);
                            setMatchVisible(true);
                            
                           
                            setTimeout(() => {
                            
                                setMatchVisible(false);
                                 setActive(false);
                            }, 6000);

                            // Send Notification
                           sendPushMatchNotification(cards[cardIndexRef.current]._id)

                        }
                    }
                    else {
                        alert(i18n.t('Fetch_Error.prbRes'));
                    }
                });


        } else {
            console.log("No rec");
            console.log("first")
        }
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = (direction) => {
        setHistory((prev) => [...prev, cardIndex]);
        position.setValue({ x: 0, y: 0 });
        setCardIndex((prev) => prev + 1);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    forceSwipe('left');
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const undoSwipe = () => {
        if (history.length === 0) return;

        const lastIndex = history[history.length - 1];
        setCardIndex(lastIndex);
        setHistory((prev) => prev.slice(0, prev.length - 1));

        // Position initiale de la carte à gauche de l'écran
        position.setValue({ x: -SCREEN_WIDTH, y: 0 });

        // Animation smooth vers le centre
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 40,
            useNativeDriver: false,
        }).start();
    };

    const renderCards = () => {
        if (cardIndex >= cards.length) {
            return (
                <View style={styles.noMoreCards}>

                </View>
            );
        }

        return cards
            .map((card, i) => {
                if (i < cardIndex) return null;

                const isCurrentCard = i === cardIndex;

                const cardStyle = isCurrentCard
                    ? [
                        styles.card,
                        {
                            transform: [
                                { rotate },
                                ...position.getTranslateTransform(),
                            ],
                        },
                    ]
                    : [styles.card, { opacity: nextCardOpacity }];

                return (
                    <Animated.View
                        key={card._id}
                        style={[cardStyle, { zIndex: cards.length - i, position: 'absolute', marginTop: 10, }]}
                        {...(isCurrentCard ? panResponder.panHandlers : {})}
                    >
                        <Image
                            source={
                                card.avatars && card.avatars.length > 0
                                    ? { uri: config.linkserver + card._id + '/images/avatar/large/' + card._id + '.jpg' }
                                    : noImg
                            }
                            style={styles.image}
                        />
                        {isCurrentCard && (
                            <>
                                <Animated.View style={[styles.likeOverlay, { opacity: likeOpacity }]}>
                                    <Text style={styles.likeText}>{i18n.t('loveSwap.like')}</Text>
                                </Animated.View>
                                <Animated.View style={[styles.nopeOverlay, { opacity: nopeOpacity }]}>
                                    <Text style={styles.nopeText}>{i18n.t('loveSwap.noLike')}</Text>
                                </Animated.View>
                            </>
                        )}
                        <View style={[styles.info, { marginBottom: 20, }]}>
                            <TouchableOpacity style={{}}
                                onPress={() => navigation.navigate('AnimalDetailsLove', {
                                    navigateTo: "SearchScreenLove",
                                    item: card,
                                    item_user: card.user_id._id,// a virer
                                    item_animal: card._id,// a virer
                                })}>


                                <Text style={styles.name}>{card.name}</Text>
                                {/* {card.description && <Text style={styles.description}>{card.description}</Text>} */}
                                {(userData.premium === undefined) &&
                                    <>
                                        {(card.latitude) &&
                                            <Text style={styles.loverdistance}>{parseInt(card.distance)} Km</Text>
                                        }

                                    </>
                                }
                            </TouchableOpacity>
                        </View>




                    </Animated.View>
                );
            })
            .reverse();
    };

    return (
        <View style={[styles.container, { marginTop: 5, }]}>{renderCards()}
            {(matchVisible === false) &&
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={[styles.roundBtn, styles.nopeBtn]} onPress={() => forceSwipe('left', cardIndex)}>
                        <Text style={styles.roundBtnText}>{i18n.t('loveSwap.no')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.roundBtn, styles.undoBtn]} onPress={undoSwipe}>
                        <Text style={styles.roundBtnText}>{i18n.t('loveSwap.undo')}</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.roundBtn, styles.likeBtn]} onPress={() => forceSwipe('right', cardIndex)}>
                        <Text style={styles.roundBtnText}>{i18n.t('loveSwap.yes')}</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    undoText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    undoButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    card: {
        width: SCREEN_WIDTH - 30,
        height: SCREEN_HEIGHT - 250,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    info: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        color: '#fff',
        fontSize: 16,
    },
    likeOverlay: {
        position: 'absolute',
        top: 50,
        left: 40,
        transform: [{ rotate: '-20deg' }],
        borderWidth: 3,
        borderColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    likeText: {
        fontSize: 32,
        color: 'green',
        fontWeight: '800',
    },
    nopeOverlay: {
        position: 'absolute',
        top: 50,
        right: 40,
        transform: [{ rotate: '20deg' }],
        borderWidth: 3,
        borderColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    nopeText: {
        fontSize: 32,
        color: 'red',
        fontWeight: '800',
    },
    noMoreCards: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    nopeText: { fontSize: 32, color: 'red', fontWeight: '800' },

    noMoreCards: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    bottomBar: {
        position: 'absolute',
        zIndex: 100,
        bottom: - SCREEN_HEIGHT + 210,
        left: 0, right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    roundBtn: {
        borderRadius: 28,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    roundBtnText: { color: '#fff', fontWeight: '700' },
    likeBtn: { backgroundColor: '#22c55e' },
    nopeBtn: { backgroundColor: '#ef4444' },
    undoBtn: { backgroundColor: '#ee92e6ff' },
    loverdistance: {
        fontStyle: 'italic',
        paddingTop: 0,
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },

});

export default LoveSwap;
