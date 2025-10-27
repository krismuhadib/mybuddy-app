import React, { useMemo, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStylesForms from "../../../assets/styles/forms";
import BDiaryStyles from "../../../assets/styles/styles";

import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import { useDispatch } from "react-redux";
import { MaterialIcons } from '@expo/vector-icons';
import RadioGroup from 'react-native-radio-buttons-group';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import KohanaInputText from '../../../components/elements/KohanaInputText';
import BDButton from '../../../components/elements/BDButton';
import { Countries } from '../../../assets/datas/Countries';
import DropdownList from '../../../components/elements/DropDownList';
import { ShowToast } from '../../../services/notification';
import DateInput from '../../../components/elements/DateInput';
import { SaveUser } from '../../../redux/slices/userSlice';


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const ChangeUserInfosScreen = (route) => {

    // User Redux Store Data
    const navigation = useNavigation();

    const storeDispatch = useDispatch();
    const userData = useSelector((state) => state.user.value);
    const animalData = useSelector((state) => state.animal.value.value);
    const [email, setEmail] = useState(userData ? userData.email : '');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [displaybutton, setDisplayButton] = useState(true);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState(userData ? userData.firstName : '');
    const [lastName, setLastName] = useState(userData ? userData.lastName : '');
    const [terms, setTerms] = useState(false);
    const [genre, setGenre] = useState(userData ? userData.genre : '');
    const [code, setCode] = useState(userData ? userData.country : '');
    const [selectedItems, setSelectedItems] = useState(null);
    const [jours, setJours] = useState("");
    const [mois, setMois] = useState("");
    const [annee, setAnnee] = useState("");
    const [birthday, setBirthday] = useState(userData ? userData.birthday : '');


    console.log("ChangeUserInfosScreen");

    useEffect(() => {
        getDatePicker();
    }, [userData]);


    useEffect(() => {
        validateForm();
    }, [emailConfirm, email, password]);


    const validateForm = () => {

        // if (!email.length || !emailConfirm.length || !password.length) {
        //     return setDisplayButton(false);
        // }
        // if (!ValidateEmail(email)) {
        //     return setDisplayButton(false);
        // }
        // if (!ValidateEmail(emailConfirm)) {
        //     return setDisplayButton(false);
        // }

        // // Different Email
        // if (email !== emailConfirm) {
        //     return setDisplayButton(false);
        // }

        // // Validate password ?
        // if (password && password.length === 0) {
        //     return setDisplayButton(false);
        // }

        return setDisplayButton(true);

    };


    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const genderItems = useMemo(() => (
        [
            {
                id: '1',
                label: i18n.t('animalProfile.man'),
                value: 'Male',
                color: Colors.greyH,
                borderColor: Colors.greyL,
            },
            {
                id: '2',
                label: i18n.t('animalProfile.woman'),
                value: 'Femelle',
                color: Colors.greyH,
                borderColor: Colors.greyL,
            },
            {
                id: '3',
                label: i18n.t('profiles.other'),
                value: 'Other',
                color: Colors.greyH,
                borderColor: Colors.greyL,
            },


        ]), []
    );

    const CountriesArrayToObjects = () => {
        const countriesObject = [];
        for (let i = 0; i < Countries.length; i++) {
            const objet = {
                title: Countries[i][0],
                code: Countries[i][1],
                indicatif: Countries[i][2],
                id: i + 1
            };
            countriesObject.push(objet);
        }
        return countriesObject;
    };

    const countriesObjectFinal = CountriesArrayToObjects(Countries);

    const handleItemSelectCountry = (nameValue, item) => {
        setCode(item.code);
    };

    const getCountryName = () => {
        for (let i = 0; i < countriesObjectFinal.length; i++) {
            if (Countries[i][1] === code) {
                return Countries[i][0];
            }
        }
        return null;
    };

    const getDatePicker = () => {
        if (birthday && birthday.slice !== 0 && birthday.slice !== undefined) {
            setJours(birthday.slice(8, 10));
            setMois(birthday.slice(5, 7));
            setAnnee(birthday.slice(0, 4));
        } else {
            setJours(i18n.t('animalProfile.dd'));
            setMois(i18n.t('animalProfile.mm'));
            setAnnee(i18n.t('animalProfile.aaaa'));
        }
        //console.log("month", month)
    };

    const handleDateChange = async (date) => {
        console.log('Date sélectionnée :', date);
        setBirthday(date);



    };


    const EditUser = async () => {
        if (email.length > 0 && userData && userData._id) {
            const res = await Post(ApiRoutes.userEdit, {
                _id: userData._id,
                email: email.toLowerCase(),
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
                lang: i18n.locale, // No conform
                country: code,
                genre: genre,
                birthday: new Date(birthday).toLocaleDateString('en-CA'),

            });

            if (res.success) {
                storeDispatch(SaveUser(res.value));
                ShowToast('success', 'Success', i18n.t('userSetting.userUpdated'));
                navigation.goBack();
            } else {
                ShowToast('error', 'Error');
            }
        }
    };



    return (
        <View style={BDiaryStylesForms.container}>

            <HeaderBuddyLeft
                // openModal={openModal}
                iconNameL="angle-left"
                //iconNameR="add"
                iconFamilyL="FontAwesome"
                //iconFamilyR="Ionicons"
                label={i18n.t('userSetting.accountInformations')}
                navigationName="User"
                navigationFrom="User"
                goBack={true}
            //navigationNameR="WelcomeUser"
            //navigationFromR="User"
            />

            <ScrollView>

                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
                    {/* <Text style={BDiaryStyles.h4}>{i18n.t('userSetting.changeEmailTxt')}</Text> */}

                    <View style={BDiaryStylesForms.formsContainer} >

                        {/* <View style={{ marginBottom: 20, padding: 10. }}>
                            <Text style={[BDiaryStylesForms.h4, { textUnderline: 20, color: Colors.greyM, textAlign: "left" }]}>{i18n.t('auth.signup.timeToComplete')}</Text>
                        </View> */}

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('animalProfile.firstName')}</Text>

                            <KohanaInputText
                                iconName='person'
                                iconClass={MaterialIcons}
                                handleValue={setFirstName}
                                valueName={firstName}
                                label={userData.firstName}
                                keyboardType='default'
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('animalProfile.name')}</Text>

                            <KohanaInputText
                                iconName='person'
                                iconClass={MaterialIcons}
                                handleValue={setLastName}
                                valueName={lastName}
                                label={userData.lastName}
                                keyboardType='default'
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('animalProfile.email')}</Text>
                            <View style={[BDiaryStylesForms.textInput, { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                                <Text style={[BDiaryStylesForms.textInputStyle, { color:Colors.greyL,}]}>{userData.email}</Text>
                            </View>
                        </View>


                        <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('animalProfile.gender')}</Text>
                            <RadioGroup
                                buttonColor={Colors.greyH}
                                radioButtons={genderItems}
                                onPress={setGenre}
                                selectedId={genre}
                                borderColor={'#000'}
                                color={Colors.greyM}
                                borderSize={10}
                                labelHorizontal={true}
                                layout={'row'}
                                labelStyle={BDiaryStyles.radioGrouplabelStyle}
                                containerStyle={BDiaryStyles.radioGroupContainer}
                            />
                        </View>

                        <View style={{ marginTop: 15, alignItems: "flex-start", justifyContent: "flex-start", alignContent: "flex-start" }}>
                            <Text style={[BDiaryStylesForms.h6, { paddingLeft: 5, paddingBottom:10 }]}>{i18n.t('animalProfile.birthday')}</Text>
                            <DateInput style={{}}jours={jours} mois={mois} annee={annee} onDateChange={handleDateChange} />
                        </View>

                        {/* Country */}
                        <View style={{ marginTop: 30, justifyContent: "flex-start", alignContent: "flex-start", justifyContent: "flex-start" }}>
                            <Text style={[BDiaryStylesForms.h6, {}]}> {i18n.t('animalProfile.country')}</Text>
                            <DropdownList
                                multiple={false}
                                search={true}
                                placeHolder={getCountryName(code)}
                                value={code}
                                nameValue={"country"}
                                listItems={countriesObjectFinal}
                                onHandlerMethod={handleItemSelectCountry}
                                selectedItems={selectedItems}
                            // datas = {geographicAvailability}
                            />
                        </View>

                    </View>

                </View>

                <View style={{ marginLeft: 40, marginRight: 40, paddingTop: 50 }}>
                    <BDButton
                        bgcolor={Colors.greenBuddy}
                        color={Colors.white}
                        display={displaybutton}
                        functionProp={() => EditUser()}
                        label={i18n.t('auth.login.submit')}
                    />
                </View>
            </ScrollView>

        </View>
    );
};


export default ChangeUserInfosScreen;


