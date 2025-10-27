import { View , TouchableOpacity, StyleSheet } from 'react-native';
import BmgStyles from "../../../assets/styles/styles"
import Colors from '../../../constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import UserActivity from '../animal/Welcome';
import ModalMenuSettings from '../../../components/modal/ModalMenuSettings';
import { useNavigation } from '@react-navigation/native';



const modalSettingScreen = () => {

  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <View style={styles.modalCloseContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <AntDesign style={{ padding: 10 }} name="closecircleo" size={25} color={Colors.accent} />
        </TouchableOpacity>
      </View>
     <ModalMenuSettings />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:0,
    flex: 1,
    backgroundColor:Colors.black
  },

  modalCloseContainer: {
    paddingBottom: 0,
    height:35,
    top: -5,
    width: "100%",
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

});

export default modalSettingScreen;