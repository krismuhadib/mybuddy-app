import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import Colors from '../../../constants/Colors';


const config = require('../../../config');

const ModalWarning = ({ setActive, active, getUserAlert, getAnimalList, getAllLovers, getAllLikers, signOut, navigateToModal, closeModal, getAllPost, isTrigger, getUserMarkers, item, animationType, closePostModal, modalVisible }) => {

    const userData = useSelector((state) => state.user.value ? state.user.value : null);
    const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
    const [modalConfirmDeleteVisible, setModalConfirmDeleteVisible] = useState(false);


    const deleteUserPost = async () => {

        let postProps = {
            post_id: item._id,
            animal_id: animalData._id,
            image_id: item.image_id,
            video_id: item.video_id,
        };

        const res = await Post(ApiRoutes.deletePost, postProps);
        if (res.success) {
            console.log("ModalWarning DEletePost OK");
            setModalConfirmDeleteVisible(false);
            closePostModal();
            getAllPost();
            isTrigger();
        }
    };
    const deleteMarker = async () => {
        await fetch(config.uri + 'markers/deletemarker', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: item._id,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    setModalConfirmDeleteVisible(false);
                    closeModal();
                    getUserMarkers();

                }
                else {
                    alert(res.message);
                    alert('PRB Delete Marker');
                }
            })


    };
    const deleteAccount = async () => {
        console.log("deleteUser");

        await fetch(config.uri + 'users/delete_account', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userData._id,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    console.log("erased", res);
                    signOut();
                }
                else {
                    console.log("PRB Delete USer")

                }
            })

    };
    const deleteLoveLiker = async () => {

        fetch(config.uri + 'animals/deletelovelikers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token' : this.state.userToken,
            },
            body: JSON.stringify({
                animal_id: animalData._id,
                liker_id: item._id,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    closeModal();
                    getAllLikers();
                    //getUserMarkers();
                    // if (likerdata.length === 0) {
                    //     this.props.navigation.navigate('MatchScreen', {
                    //         reload: true,
                    //     });

                    // }
                }
                else {
                    alert(i18n.t('Fetch_Error.prbRes'));
                }
            });

    };
    const deleteLover = async () => {
        await fetch(config.uri + 'animals/deletelovers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token' : this.state.userToken,
            },
            body: JSON.stringify({
                animal_id: animalData._id,
                lover_id: item._id,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    closeModal();
                    getAllLovers();
                }
                else {
                    alert(i18n.t('Fetch_Error.prbRes'));
                }
            });

    };
    const DeleteProfile = async () => {
        await fetch(config.uri + 'animals/deleteanimal', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: item,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              getAnimalList();
              closeModal();

            }
            else {
              alert(res.message);
              alert('PRB Delete Animal');
            }
          })
    
    
    
    };

    const deleteAlert = async () => {
    await fetch(config.uri + 'alerts/deletealert', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id: item._id,
            animal_id: animalData._id
        })
    })
        .then((response) => response.json())
        .then((res) => {
            if (res.success === true) {
                setModalConfirmDeleteVisible(false);
                closeModal();
                getUserAlert();

            }
            else {
                alert(res.message);
                alert('PRB Delete Marker');
            }
        })


    };

        const deleteFirstConnect = async () => {
    await fetch(config.uri + 'users/firstconnect', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userData._id,
        })
    })
        .then((response) => response.json())
        .then((res) => {
            if (res.success === true) {
                setModalConfirmDeleteVisible(false);
                closeModal();
                setActive(false);
                //getUserAlert();

            }
            else {
                alert(res.message);
                alert('PRB Delete Marker');
            }
        })


    };








    const GotoLogin = () => {


    };


    return (
        <View style={BDiaryStyles.container}>

            <Modal
                animationType={animationType}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    closeModal();
                }}>

                <View style={[BDiaryStyles.centeredView, {backgroundColor: 'rgba(0,0,0,0.1)',}]}>
                    <View style={BDiaryStyles.modalView}>

                        {(navigateToModal !== "Birthday" && navigateToModal !== "FirstConnect") &&
                            <Text style={BDiaryStyles.modalTitle}> {i18n.t('Modal.confirmation')}</Text>
                        }
                        {(navigateToModal === "Birthday") &&
                            <Text style={BDiaryStyles.modalTitle}> {i18n.t('Modal.birthdayTitle')}</Text>
                        }
                         {(navigateToModal === "FirstConnect") &&
                            <Text style={BDiaryStyles.modalTitle}> {i18n.t('Modal.WelcomeModal')}</Text>
                        }


                        {(navigateToModal === "Home") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.Warning_comment_message')}</Text>
                            </View>
                        }
                        {(navigateToModal === "Map") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.warningDeleteMarker')}</Text>
                            </View>
                        }

                         {(navigateToModal === "Alert") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.warningDeleteAlert')}</Text>
                            </View>
                        }

                        {(navigateToModal === "Love") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.warningDeleteLove')}</Text>
                            </View>
                        }
                        {(navigateToModal === "DeleteLover") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.warningDeleteLover')}</Text>
                            </View>
                        }
                        {(navigateToModal === "DeleteProfile") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.warningDeleteProfile')}</Text>
                            </View>
                        }

                         {(navigateToModal === "FirstConnect") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.WelcomeText')}</Text>
                            </View>
                        }



                        {(navigateToModal === "User") &&
                            <View>
                                <Text style={[BDiaryStyles.modalText]}>{i18n.t('Modal.WarningDeleteAccount')}</Text>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.WarningDeleteAccountTxt')}</Text>

                            </View>

                        }
                        {(navigateToModal === "Birthday") &&
                            <View>
                                <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.warningBirthday')}</Text>
                            </View>
                        }


                        <View style={{ flexDirection: "row", width: "80%", alignContent: "space-between", justifyContent: "space-between", alignItems: "center" }}>
                            {(navigateToModal === "Birthday") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                                    onPress={closeModal}>
                                    <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('Modal.Ok')}</Text>
                                </TouchableOpacity>
                            }

                            {(navigateToModal !== "Birthday" && navigateToModal !== "FirstConnect") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                                    onPress={closeModal}>
                                    <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('Form.Cancel')}</Text>
                                </TouchableOpacity>
                            }

                            {(navigateToModal === "FirstConnect") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                                    onPress={()=> deleteFirstConnect()}>
                                    <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('Modal.WelcomeGo')}</Text>
                                </TouchableOpacity>
                            }





                            {(navigateToModal === "Home") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deleteUserPost()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }
                            {(navigateToModal === "Love") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deleteLoveLiker()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }

                            {(navigateToModal === "DeleteLover") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deleteLover()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }


                            {(navigateToModal === "Map") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deleteMarker()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }

                            {(navigateToModal === "Alert") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deleteAlert()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }

                            {(navigateToModal === "User") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => deleteAccount()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }
                            {(navigateToModal === "DeleteProfile") &&
                                <TouchableOpacity
                                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                                    onPress={() => DeleteProfile()}>
                                    <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
                                </TouchableOpacity>
                            }
                            


                        </View>

                    </View>

                </View>

            </Modal>

        </View>
    );
};



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.white
    },



});

export default ModalWarning;


