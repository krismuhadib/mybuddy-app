import React, { useState } from 'react';
import { Dimensions, Modal, TouchableOpacity, FlatList, Text, View, StyleSheet, TextInput } from 'react-native';
import Colors from '../../constants/Colors';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import BmgStyles from "../../assets/styles/styles";
import { i18n } from "../../constants/Localization";
//import { roundNumber } from 'i18n-js/typings/helpers';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;



const DropDownList = ({ search, placeHolder, nameValue, value, multiple, listItems, onHandlerMethod }) => {

  const defaultDataStored = (data, multiple) => {
    if (multiple) {
      return data && data.length ? value : [];
    } else {
      return data ? data : '';
    }
  };

  const [selectedItems, setSelectedItems] = useState(defaultDataStored(value, multiple));
  const [modalSelectMenuVisible, setModalSelectMenuVisible] = useState(false);
  const [itemName, setItemName] = useState(value);
  const [searchText, setSearchText] = useState('');
  const [listItem, setlistItem] = useState(listItems);



  const openListModal = () => {
    setModalSelectMenuVisible(true);
  };

  const getNameFromArray = (arr, data) => {
    if (data) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === data) {
          return arr[i].title;
        }
      }
      return null
    }
  };

  const extractName = (selected) => {
    const CantonsNames = [];
    selected.forEach(index => {
      const item = listItems.find(item => item.id === index);
      if (item) {
        CantonsNames.push(item.title);
      }
    });
    return (CantonsNames[0]);
  };


  const dropdonePlaceholder = (text) => {
    return (
      <View>
        <Text style={{ top: 2, color: Colors.greyM }}>{text}</Text>
      </View>
    )
  };

  const checkItem = (list, item) => {
    if (!multiple) {
      return item.id === list;
    } else {
      return list.includes(item.id);
    }
  };

  const checkItemSearch = (value,item) => {
    if (value) {
      return item.code.includes(value);
    }
    return null
  };

  const displayMark = () => {
    return (
      <View style={{ alignContent: "", width: 50 }}>
        <Ionicons name="checkmark" size={24} color={Colors.white} />
      </View>
    )
  };

  const getCountryName = () => {
    for (let i = 0; i < listItem.length; i++) {
      if (Countries[i][1] === code) {
        return Countries[i][0];
      }
    }
    return null;
  };

  const buttonValue = (selectedArray) => {
    if (selectedArray.length > 0) {
      return (
        <>
          {(search !== true) &&
            <View style={{ flexDirection: "row", alignContent: "Flex-start", alignItems: "center", justifyContent: "flex-start" }}>
              <Ionicons name="checkmark" size={22} color={Colors.white} />
              <Text style={[BmgStyles.h4Middle, { padding: 10, textTransform: "capitalize" }]}>{extractName(selectedItems)}</Text>
              {(selectedItems.length > 1) &&
                <Text style={[BmgStyles.h4Middle, { marginLeft: -10, textTransform: "capitalize" }]}>, ...</Text>
              }
            </View>
          }
          {(search === true) &&
            <View style={{ flexDirection: "row", alignContent: "Flex-start", alignItems: "center", justifyContent: "flex-start" }}>
              <Ionicons name="checkmark" size={22} color={Colors.white} />
              <Text style={[BmgStyles.h4Middle, { padding: 10, textTransform: "capitalize" }]}>{getCountryName(selectedItems)}, ...</Text>
            </View>
          }
        </>
      )
    } else {
      return (
        <View style={{ flexDirection: "row", alignContent: "Flex-start", alignItems: "center", justifyContent: "flex-start" }}>
          <Text style={[BmgStyles.h4Middle, { padding: 0, top: 3 }]}>{dropdonePlaceholder(placeHolder)}</Text>
        </View>
      )
    }
  };

  // Fonction de filtrage des données
  const filterData = (text) => {
    setSearchText(text);
    const filteredData = listItems.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setlistItem(filteredData);
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (multiple) {
            if (selectedItems) {
              let tmpSelectedItem = [...selectedItems];
              if (checkItem(selectedItems, item)) {
                tmpSelectedItem = tmpSelectedItem.filter(element => element !== item.id);
              } else {
                tmpSelectedItem.push(item.id);
              }
              setSelectedItems(tmpSelectedItem);
              onHandlerMethod(nameValue, tmpSelectedItem);
            }
          } else {
            onHandlerMethod(nameValue, item.id);
            setItemName(item.id);
            setModalSelectMenuVisible(false);
            setSelectedItems(item.id);
          }
          if (search) {
            onHandlerMethod(nameValue, item);
            setItemName(item.id);
            setModalSelectMenuVisible(false);
            setSelectedItems(item.id);
          }
        }}
        style={styles.dropdownRowStyle}
      >

        {(!search) &&
          <View style={styles.dropdownMultipleContainer}>
            <Text style={styles.dropdownRowMark}> {checkItem(selectedItems, item) ? displayMark() : ""} </Text>
            <Text style={styles.dropdownRowTxtStyleMultiple}>{item.title} </Text>
          </View>
        }

       
        {(search) &&
          <View style={styles.dropdownSearchContainer}>
            <Text style={styles.dropdownRowMark}> {checkItemSearch(value, item) ? displayMark() : ""} </Text>
            <Text style={styles.dropdownRowTxtStyleSearch}>{item.title} </Text>
          </View>
        }

        {/* {(!multiple) &&
          <Text style={styles.dropdownRowTxtStyle}>{item.title}</Text>
        } */}
      </TouchableOpacity>
    </View>
  );

  const getTitleFromCode = (code) => {
    const item = listItem.find(item => item.code === code);
    return item ? item.title : "Code non trouvé";
}

  return (
    <View style={{flex: 1 }}>
      <View style={styles.dropdownButton}>
        <TouchableOpacity
          onPress={() => openListModal(listItems, nameValue)}
          style={styles.dropdownButtonContainer}>
          {(multiple) &&
            <Text style={styles.dropdownButtonTxtStyle}>{buttonValue(selectedItems) ? buttonValue(selectedItems) : dropdonePlaceholder(placeHolder)}</Text>
          }
          {(!multiple && !search) &&
            <Text style={styles.dropdownButtonTxtStyle}>{getNameFromArray(listItems, itemName) ? getNameFromArray(listItems, itemName) : dropdonePlaceholder(placeHolder)}</Text>
          }
          {(!multiple && search && value) &&
            <Text style={styles.dropdownButtonTxtStyle}>{getTitleFromCode(value)}</Text>
          }
          {(!multiple && search && !value) &&
            <Text style={styles.dropdownButtonTxtStyle}>{getNameFromArray(listItems, itemName)}</Text>
          }

          <AntDesign style={styles.dropdownButtonIcon} name="down" size={16} color={Colors.greyM} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalSelectMenuVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setModalSelectMenuVisible(false)}
      >
        <View style={styles.dropdownModal}>
          <View style={{ top: 40, }}>
            <View style={styles.modalContainer}>

              {(search === true) &&
                <>
                  <View style={{ flexDirection: "row", }}>

                    <View style={{
                      top: 0,
                      width: ScreenWidth - 80,
                      height: 40,
                      color: "#fff",
                      borderRadius: 25,
                      overflow: 'hidden',
                      color: Colors.white,
                      margin: 0,
                      paddingLeft: 10,
                      backgroundColor: Colors.background,
                      borderWidth: 1,
                      borderColor: Colors.secondary_alpha,
                    }}>

                      <View style={{ flexDirection: "row" }}>

                        <Feather style={{ padding: 5, top:2, }} name="search" size={22} color={Colors.greyH} />

                        <TextInput
                          style={BmgStyles.textInputStyle}
                          autoComplete='off'
                          placeholderTextColor={Colors.greyM}
                          placeholder={i18n.t('userSetting.search')}
                          value={searchText}
                          onChangeText={filterData}
                        />

                      </View>

                    </View>
                    <TouchableOpacity
                      style={{ flex: 1, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end" }}
                      onPress={() => setModalSelectMenuVisible(false)}>
                      <AntDesign style={{ padding: 5, paddingRight: 10, top: -2 }} name="close-circle" size={25} color={Colors.greyH} />
                    </TouchableOpacity>
                  </View>
                </>
              }

              {(search !== true) &&
                <View style={styles.modalCloseContainer}>
                  <TouchableOpacity
                    onPress={() => setModalSelectMenuVisible(false)}>
                    <AntDesign style={{ padding: 10 }} name="closecircleo" size={25} color={Colors.greyH} />
                  </TouchableOpacity>
                </View>
              }



              <FlatList
                showsVerticalScrollIndicator={false}
                data={listItem}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ flexGrow: 1 }}
                ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
                ListFooterComponent={<View style={{ height: 100 }}>

                </View>}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({

  modalCloseContainer: {
    width: "100%",
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

  dropdownModal: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },

  modalContainer: {
    flexDirection: "column",
  },

  dropdownButtonTxtStyle: {
    top: 3,
    textTransform: "capitalize",
    marginLeft: -1,
    fontSize: 14,
    textAlign: 'left',
    color: Colors.greyH,
  },
  dropdownButtonContainer: {
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownButtonIcon: {
    borderWidth: 0,
    borderColor: "#FFF",
    padding: 10,
    marginRight: 5
  },

  dropdownButton: {
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 25,
    overflow: 'hidden',
    margin: 0,
    height: 40,
    paddingLeft: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
  },

  dropdownRowStyle: {
    borderBottomWidth: 1,
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    width: "100%",
    flexDirection: "row",
    padding: 10,
    margin: 0,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.greyL
  },

  dropdownRowTxtStyle: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center'
  },

  dropdownSearchContainer: {
    width: "100%",
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
    justifyContent: "flex-start",
  },


  dropdownMultipleContainer: {
    width: "100%",
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownRowTxtStyleSearch: {
    marginRight: 0,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 60,
    padding: 5,
    fontSize: 14,
    color: Colors.greyH,
    textAlign: 'center'
  },

  dropdownRowTxtStyleMultiple: {
    marginRight: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 40,
    padding: 5,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  },
  dropdownRowMark: {
    width: 50,
  },

});

export default DropDownList
