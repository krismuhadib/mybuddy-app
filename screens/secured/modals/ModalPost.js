import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, Platform, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const ModalPost = ({ getAllPost, updatePostLike, item, animationType, closePostModal, post_animal_id, userToken, animal_id, modalVisible, navigateToModal }) => {

    // User Redux Store Data
    const navigation = useNavigation();
    const userData = useSelector((state) => state.user.value);
    const animalData = useSelector((state) => state.animal.value);
    const [modalConfirmDeleteVisible, setModalConfirmDeleteVisible] = useState(false);
    const [uri, setUri] = useState("");
    console.log("ModalPost");


    const _onClose = () => {
        closePostModal();
    };

    useEffect(() => {
    }, []);

    const addLikes = (item) => {
        console.log("Addlike ModalPost")
        updatePostLike(item._id)
        fetch(config.uri + 'posts/likes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token' : this.state.userToken,
            },
            body: JSON.stringify({
                animal_id: animalData._id,
                post_id: item,
                favorites: animalData._id,
                likers: animalData._id,
                language: i18n._locale,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    // Sending Notifications rules
                    // Send if its different user with differents animals

                    //this.sendLikeNotifs(item);
                    //let favorites = this.state.favorite;
                    // console.log("le this.props.navigateToModal", this.props.navigateToModal)

                    closePostModal();
                    // Home
                    //   if (this.state.navigateToModal === "Home") {
                    //    navigation.navigate("Home", {
                    //       navigateTo: "Home",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };
                    //   if (this.state.navigateToModal === "AddComment") {
                    //     this.props.navigation.navigate("AddComment", {
                    //       navigateTo: "Home",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };
                    //   if (this.state.navigateToModal === "PostView") {
                    //     this.props.navigation.navigate("PostView", {
                    //       navigateTo: "PostView",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };

                    //   // Search
                    //   if (this.state.navigateToModal === "AddCommentSearchScreen") {
                    //     this.props.navigation.navigate("AddCommentSearchScreen", {
                    //       navigateTo: "AddCommentSearchScreen",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };

                    //   if (this.state.navigateToModal === "PostViewSearch") {
                    //     this.props.navigation.navigate("PostViewSearch", {
                    //       navigateTo: "PostViewSearch",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };

                    //   // Map

                    //   if (this.state.navigateToModal === "PostViewMap") {
                    //     this.props.navigation.navigate("PostViewMap", {
                    //       navigateTo: "PostViewMap",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };

                    //   // Send

                    //   if (this.state.navigateToModal === "PostViewSend") {
                    //     this.props.navigation.navigate("PostViewSend", {
                    //       navigateTo: "PostViewSend",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };

                    // Bookmarks
                    //   if (this.state.navigateToModal === "PostViewBookmarks") {
                    //     this.props.navigation.navigate("BookmarkScreen", {
                    //       navigateTo: "BookmarkScreen",
                    //       reload: true,
                    //       item: item
                    //     });
                    //   };
                }
                else {
                    alert(i18n.t('Fetch_Error.prbRes'));
                }
            });

    };

    const openModalDeletePost = (item) => {
        setModalConfirmDeleteVisible(true);
    };

    const closeModalDeletePost = () => {
        setModalConfirmDeleteVisible(false);
    };

    const GoToSettingSignalmentScreen = (item) => {
        closePostModal();
        navigation.navigate('SignalmentScreen', {
            from: "Home ",
            item: item,
            animal_id: post_animal_id,
        });
    };

    const GoToAddComment = (item) => {
        closePostModal();
        navigation.navigate('AddComment', {
            from: "Home",
            screen: 'AddComment',
            postUpdate: item,
            newcomment: true,
        })
    };

    const openShareDialogAsync = async (item) => {
        if (Platform.OS === 'web') {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }
        try {
            const downloadRes = await FileSystem.downloadAsync(
                `${config.linkserver}${item.animal_id._id}/images/posts/${item.image_id}.jpg`,
                FileSystem.documentDirectory + item.image_id + '.jpeg'
            );
            await Sharing.shareAsync(downloadRes.uri, {
                mimeType: 'image/jpeg',
                dialogTitle: item.comment || "Partage",
            });

        } catch (error) {
            console.error("Erreur lors du partage :", error);
        }
    };

    const deletePost = async () => {
        fetch(config.uri + 'posts/deleteuserpost', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                //   token: this.state.token,
                post_id: item._id,
                animal_id: animalData._id,
                image_id: item.image_id,
                video_id: item.video_id,

            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    getAllPost();
                    console.log("Delete Post Id ", res)
                    setModalConfirmDeleteVisible(false);
                    closePostModal();
                }
                else {
                    alert(res.message);
                    alert('Prb Delete Post');
                }
            });

        // if (this.state.navigateToModal === "AddCommentSearchScreen") {
        //   const whicfrom = this.props.navigateToModal;
        //   this.props.navigation.navigate("SearchScreen", {
        //     navigateTo: "SearchScreen",
        //     reload: true,

        //   });
        // };

        // if (this.state.navigateToModal === "PostView") {
        //   this.props.navigation.navigate("AnimalDetails", {
        //     navigateTo: "Home",
        //     item: this.state.item,
        //     // this.state.userToken: this.state.userToken,
        //     item_user: this.state.item.user_id._id,// a virer
        //     item_animal: this.state.item.animal_id._id,// a virer
        //     reload: true,

        //   });
        // };

        // if (this.state.navigateToModal === "AddComment") {
        //   this.props.navigation.navigate("Home", {
        //     navigateTo: "Home",
        //     reload: true,

        //   });
        // };
        // if (this.state.navigateToModal !== "PostView" && this.state.navigateToModal !== "AddComment" && this.state.navigateToModal !== "AddCommentSearchScreen") {



        //   const whicfrom = this.props.navigateToModal;
        //   this.props.navigation.navigate(whicfrom, {
        //     navigateTo: whicfrom,
        //     reload: true,
        //   });
        // }
        // var reload = true;
        // if (this.state.navigateToModal === "AddComment") {
        //   this.props.navigation.navigate("Home", {
        //     navigateTo: "Home",
        //     reload: true,
        //   });

        // } else {
        //    const whicfrom = this.props.navigateToModal;
        // this.props.navigation.navigate(whicfrom, {
        //   navigateTo: whicfrom,
        //   reload: true,
        // });
        // }


    };

    const goToLegendScreen = () => {
        closePostModal();
        navigation.navigate('LegendScreen');
    };

    const GoToAnimalProfile = (item) => {
        closePostModal();
        navigation.navigate('AnimalDetails', {
            navigateTo: "Home ",
            item: item,
            animal_id: item.animal_id._id,
        });
    };

    const modalBackgroundStyle = { backgroundColor: 'rgba(0, 0, 0, 0.8)' };

    return (
        <View style={BDiaryStyles.container}>

            <Modal
                animationType={animationType}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    _onClose();
                }}>
                <View style={[styles.container, modalBackgroundStyle]}>
                    <View style={[styles.innerContainerTransparentStyle]}>
                        {/* CLOSE PAN */}
                        <TouchableOpacity onPress={() => _onClose()}>
                            <View style={[styles.CloseButton]}></View>
                            {/* <View style={[styles.bloc_Row]}>
                                <View style={[styles.bloc_]}>
                                <Text style={{textAlign: 'center',fontSize: 20,fontWeight:'bold'}}>Modal title</Text>
                                </View>
                                <View style={[styles.bloc_right]}>
                                <Ionicons style={{textAlign: 'right', paddingLeft: 10}} name="md-close" size={20} color="black" /> 
                            </View>
                            </View>
                            */}
                        </TouchableOpacity>
                        {/* Signalement Settings */}

                        {/* <View style={{ height: 40 }}>
                            <TouchableOpacity style={styles.buttontouch} onPress={async () => addLikes(item)}>
                                <View style={styles.buttontouchicon}>
                                    <Ionicons name='heart-outline' size={22} color={Colors.greyH} />
                                </View>
                                <View>
                                    <Text style={styles.buttontouchtext}>
                                        {(item.favorites ?? []).includes(animalData._id)
                                            ? i18n.t('Modal.UnLike_Post')
                                            : i18n.t('Modal.Like_Post')}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                        <AntDesign name="right" size={20} color={Colors.greyH} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View> */}


                        <View style={{ height: 40 }}>
                            <TouchableOpacity style={styles.buttontouch} onPress={async () => GoToAddComment(item)}>
                                <View style={styles.buttontouchicon}>
                                    <AntDesign name='message' size={22} color={Colors.greyH} />
                                </View>
                                <View >
                                    <Text style={styles.buttontouchtext}>{i18n.t('Modal.Add_Comment')}</Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                        <AntDesign name="right" size={20} color={Colors.greyH} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 40 }}>
                            <TouchableOpacity style={styles.buttontouch} onPress={async () => GoToAnimalProfile(item)}>
                                <View style={styles.buttontouchicon}>
                                    <Feather name='eye' size={22} color={Colors.greyH} />
                                </View>
                                <View >
                                    <Text style={styles.buttontouchtext}>{i18n.t('Page.See_Profile')}</Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                        <AntDesign name="right" size={20} color={Colors.greyH} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* Animal Profil  */}
                        {/*  <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToAnimalProfile(this.props.item)}>
                    
                    <View style={styles.buttontouchicon}>
                        <MaterialIcons name='pets' size={25} color={Colors.greyH} />
                    </View>
                    <View >
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.Animal_Profile')}</Text>
                    </View>
                        
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color={Colors.greyH} />
                        </View>
                    </View>
                </TouchableOpacity>
                </View> */}

                        {/* Friends post's animal */}
                        {/*  <View style={{height:50}}>
                    <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToFriendsScreen()}>
                        <View style={styles.buttontouchicon}>
                            <MaterialIcons name='group' size={25} color={Colors.greyH} />
                        </View>
                        <View >
                            <Text style={styles.buttontouchtext}>{i18n.t('Page.SeePostfriends')}</Text>
                        </View>
                        
                        <View style={{ flex: 1 }}>
                            <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                <AntDesign name="right" size={20} color={Colors.greyH} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> */}
                        {/* User Settings */}
                        <View style={{ height: 40 }}>
                            <TouchableOpacity style={styles.buttontouch} onPress={async () => openShareDialogAsync(item)}>
                                <View style={styles.buttontouchicon}>
                                    <Feather name='share-2' size={22} color={Colors.greyH} />
                                </View>
                                <View >
                                    <Text style={styles.buttontouchtext}>{i18n.t('Page.SharePost')}</Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                        <AntDesign name="right" size={20} color={Colors.greyH} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 40 }}>
                            <TouchableOpacity style={styles.buttontouch} onPress={async () => goToLegendScreen()}>
                                <View style={styles.buttontouchicon}>
                                    <Feather name='help-circle' size={22} color={Colors.greyH} />
                                </View>
                                <View >
                                    <Text style={styles.buttontouchtext}>{i18n.t('Page.SeeLegends')}</Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                        <AntDesign name="right" size={20} color={Colors.greyH} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {(animal_id !== post_animal_id) &&
                            <View style={{ height: 40 }}>
                                <TouchableOpacity style={styles.buttontouch} onPress={() => GoToSettingSignalmentScreen(item)}>

                                    <View style={styles.buttontouchicon}>
                                        <MaterialCommunityIcons name='alert' size={22} color={Colors.red} />
                                    </View>
                                    <View >
                                        <Text style={styles.buttontouchtextRed}>{i18n.t('Page.Signalment')}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                            <AntDesign name="right" size={20} color={Colors.greyH} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        {(animal_id === post_animal_id) &&
                            <View style={{ height: 40 }}>
                                <TouchableOpacity style={styles.buttontouch} onPress={() => openModalDeletePost(item)}>
                                    <View style={styles.buttontouchicon}>
                                        <Ionicons name='trash-sharp' size={22} color={Colors.red} />
                                    </View>
                                    <View >
                                        <Text style={styles.buttontouchtextRed}>{i18n.t('Modal.Delete_Post')}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                                            <AntDesign name="right" size={20} color={Colors.greyH} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>

                {(modalConfirmDeleteVisible === true) &&
                    <View style={[BDiaryStyles.centeredView]}>
                        <View style={[BDiaryStyles.modalView]}>
                            <Text style={BDiaryStyles.modalTitle}>{i18n.t('Modal.Warning')}</Text>
                            <View>
                                <Text style={BDiaryStyles.modalText}> {i18n.t('Modal.Warning_comment_message')}</Text>
                            </View>

                            <View style={{ flexDirection: "row", width: "80%", alignContent: "space-between", justifyContent: "space-between", alignItems: "center" }}>
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                                    onPress={() => closeModalDeletePost()}>
                                    <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('Form.Cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deletePost()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                }

            </Modal>
        </View>
    );
};



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    buttontouchicon: {
        marginLeft: 0,
    },

    buttontouchtext: {
        marginLeft: 20,
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        //textAlign:'left',
        //justifyContent: 'center',
    },

    buttontouchtextRed: {
        marginLeft: 20,
        fontFamily: 'Roboto-Regular',
        color: "red",
        fontSize: 15,
        //textAlign:'left',
        //justifyContent: 'center',
    },

    buttontouch: {
        marginRight: 20,
        marginLeft: 20,
        flex: 1,
        flexDirection: 'row',
        height: 70,
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        opacity: 0.9,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    CloseButton: {
        padding: 10,
        justifyContent: 'flex-start',
        height: 10,
        marginLeft: 180,
        marginRight: 180,
        borderBottomColor: '#c0c0c0',
        opacity: 0.9,
        borderBottomWidth: 5,
        marginBottom: 20,

    },

    innerContainerTransparentStyle: {
        width: ScreenWidth,
        flex: 1,
        top: ScreenHeight / 1.8,
        backgroundColor: '#FFF',
        //height: 450,
        borderRadius: 22,
    },

});

export default ModalPost;


