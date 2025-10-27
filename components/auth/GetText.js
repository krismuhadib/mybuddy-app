import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Post, ApiRoutes } from '../../services/api'
import Forms from '../../assets/styles/forms';
import { i18n } from "../../constants/Localization";

const GetText = () => {

	const [title, setTitle] = useState(null);
	const [subTitle, setSubTitle] = useState(null);

	useEffect(() => {
		GetText();
	}, []);


	const GetText = async () => {
		const res = await Post(ApiRoutes.getText, {
			type: 'login',
			language: i18n.locale // No conform
		});
		if (res.success) {
			setTitle(res.title);
			setSubTitle(res.subtitle);
		} else {
			//ShowToast(CheckBackendErrors(res.error));
		}
	};


	return (
		<>
			{(title && subTitle) &&
				<View style={styles.container}>
					<View style={{ padding: 0 }}>
						<Text style={[Forms.welcome, { textAlign: "center", paddingTop: 0, }]}>{title}</Text>
						<Text style={[Forms.welcome, { textAlign: "center", paddingTop: 10, }]}>{subTitle}</Text>
					</View>
				</View>
			}
		</>
	)
};

const styles = StyleSheet.create({
	container: {
		marginLeft:30,
		marginRight:30,
		flexDirection: "column",
		alignItems: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		paddingTop: 20,
		padding: 0,
	},
});

export default GetText;