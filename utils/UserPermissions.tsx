import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';



class UserPermissions {

    
    getCameraRollPermission = async () => {
        if (Constants.platform.ios) {
            const {status} = await ImagePicker.requestCameraPermissionsAsync()
            if (status != "granted") {
                alert("We need your permisson to usu your camera roll");
            }
        }
    };

    getCameraPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            //const {status} = await Permissions.askAsync(Permissions.CAMERA)
            if (status != "granted") {
                alert("We need your permisson to usu your camera");
            }
        }
    };


}










  
export default new UserPermissions();