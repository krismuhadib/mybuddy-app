import * as React from 'react';

//import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';


import Colors from '../constants/Colors';

export default function TabBarIcon(props: { name: string; color: string }) {
  return (
    <MaterialCommunityIcons
      size={30}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}
