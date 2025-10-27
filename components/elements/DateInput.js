import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import moment from 'moment';
import Colors from '../../constants/Colors';

const DateInput = ({ jours, mois, annee, onDateChange }) => {

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  // useEffect(() => {
  //   handleYearChange();
  // }, [yearRef]);


  const handleDayChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, ''); // Garde uniquement les chiffres
    if (formattedText.length <= 2) {
      setDay(formattedText);
      if (formattedText.length === 2) {
        monthRef.current.focus(); // Passe au mois après 2 chiffres
      }
    }
  };

  const handleMonthChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, '');
    if (formattedText.length <= 2) {
      setMonth(formattedText);
      if (formattedText.length === 2) {
        yearRef.current.focus(); // Passe à l'année après 2 chiffres
      }
    }
  };

  const handleYearChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, '');
    if (formattedText.length <= 4) {
      setYear(formattedText);
      if (formattedText && formattedText.length === 4) {
        const formattedDate = moment(`${formattedText}-${month}-${day}`, 'YYYY-MM-DD');
        if (formattedDate.isValid() && onDateChange) {
          onDateChange(formattedDate.toDate()); // Retourne la date au format `Date`
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor={Colors.greyM}
        style={[styles.input, { color: Colors.greyM }]}
        keyboardType="numeric"
        placeholder={jours}
        value={day}
        onChangeText={handleDayChange}
        maxLength={2}

      />
      <Text style={{ color: Colors.greyM }}>/</Text>
      <TextInput
        placeholderTextColor={Colors.greyM}
        style={[styles.input, { color: Colors.greyM }]}
        keyboardType="numeric"
        placeholder={mois}
        value={month}
        onChangeText={handleMonthChange}
        maxLength={2}
        ref={monthRef}
      />
      <Text style={{ color: Colors.greyM }}>/</Text>
      <TextInput
        placeholderTextColor={Colors.greyM}
        style={[styles.year, { color: Colors.greyM }]}
        keyboardType="numeric"
        placeholder={annee}
        value={year}
        onChangeText={handleYearChange}
        maxLength={4}
        ref={yearRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent:"center",
    //borderWidth:1
  },
  input: {
    color: Colors.black,
    fontSize: 15,
    borderBottomWidth: 1,
    borderColor: Colors.greyL,
    paddingBottom: 5,
    lineHeight:20,
    //padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    width: 40, // Largeur pour les champs jour et mois
  },
  year: {
   color: Colors.black,
    fontSize: 15,
    borderBottomWidth: 1,
    borderColor: Colors.greyL,
    paddingBottom: 5,
    lineHeight:20,
    //padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    width: 60, // Largeur pour les champs jour et mois
  },

});

export default DateInput;