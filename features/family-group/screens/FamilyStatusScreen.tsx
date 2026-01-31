import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types'

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyStatus'>;

export default function FamilyStatusScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color="#D48141" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/familier_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Image
          source={require('../../../assets/family_illustration.png')} 
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.title}>Family Status</Text>
        <Text style={styles.subtitle}>
          Let us know so we can connect{"\n"}you with your family!
        </Text>

        <TouchableOpacity
        >
          <View style={styles.iconBox}>
            <Ionicons name="people-outline" size={32} color="#D48141" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>You already have a family group</Text>
            <Text style={styles.cardDesc}>Join an existing family group.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('CreateFamily')}
        >
          <View style={styles.iconBox}>
            <MaterialIcons name="person-add-alt" size={32} color="#D48141" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>No family group yet</Text>
            <Text style={styles.cardDesc}>Create a new family group</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  backButton: {
    paddingLeft: 10,
    paddingTop: 30, 
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  illustration: {
    width: '100%',
    height: 220,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D48141',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#D48141',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF5E6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D48141',
  },
  cardDesc: {
    fontSize: 12,
    color: '#D48141',
    fontStyle: 'italic',
    opacity: 0.7,
  },
});