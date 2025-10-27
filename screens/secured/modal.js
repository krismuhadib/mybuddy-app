import { View , TouchableOpacity, StyleSheet } from 'react-native';
import BDiaryStyles from "../../assets/styles/styles"
import Colors from '../../constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import UserActivity from './animal/Welcome';
import WelcomeScreen from './animal/Welcome';
import { useNavigation } from '@react-navigation/native';

const ModalScreen = ({ }) => {
  const navigation = useNavigation();


  return (
    <View style={BDiaryStyles.container}>
      {/* <View style={styles.modalCloseContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <AntDesign style={{top: 0 }} name="closecircleo" size={25} color={Colors.accent} />
        </TouchableOpacity>
      </View> */}
      <WelcomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({

  modalCloseContainer: {
    zIndex:20,
    paddingBottom: 0,
    height:35,
    top: -5,
    width: "100%",
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

});

export default ModalScreen;