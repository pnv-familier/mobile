import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FamilyParamsList } from '../types';
import { useLogout } from '../../auth/hooks/useLogout';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<FamilyParamsList, 'FamilyStatus'>;

export default function FamilyStatusScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { logout } = useLogout();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={logout}
      >
        <Ionicons name="chevron-back" size={28} color="#D48141" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Image
          source={require('../../../assets/family_illustration.png')} 
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.title}>{t('family.familyStatus')}</Text>
        <Text style={styles.subtitle}>
          {t('family.chooseOption')}
        </Text>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('JoinFamily')}
        >
          <View style={styles.iconBox}>
            <Ionicons name="people-outline" size={32} color="#D48141" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{t('family.joinFamily')}</Text>
            <Text style={styles.cardDesc}>{t('family.joinFamilyDesc')}</Text>
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
            <Text style={styles.cardTitle}>{t('family.createFamily')}</Text>
            <Text style={styles.cardDesc}>{t('family.createFamilyDesc')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  backButton: {
    paddingHorizontal: 15,
    paddingTop: 30,
    zIndex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 30, 
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  illustration: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D48141',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#D48141',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 25,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF5E6',
    borderRadius: 12,
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
    marginTop: 2,
  },
});