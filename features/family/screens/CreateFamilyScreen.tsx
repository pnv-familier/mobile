import React from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, ScrollView, ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateFamily } from '../hooks/useCreateFamily';

export default function CreateFamilyScreen({ navigation }: any) {
  const {
    familyName,
    setFamilyName,
    loading,
    suggestions,
    handleContinue,
    validationError,
    isFormValid,
    handleInputFocus
  } = useCreateFamily();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#D48141" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a family</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.circleOutline}>
            <View style={styles.innerCircle}>
              <MaterialCommunityIcons name="home-variant-outline" size={60} color="#D48141" />
            </View>
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.mainTitle}>Name the family</Text>
        <Text style={styles.instructionText}>Choose a special name for your family</Text>

        <View style={[styles.inputContainer, validationError ? styles.inputErrorBorder : null]}>
          <MaterialCommunityIcons name="home-outline" size={24} color="#D48141" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Example: Pink Family"
            placeholderTextColor="#E0C3A5"
            value={familyName}
            onChangeText={setFamilyName}
            onFocus={handleInputFocus}
          />
        </View>
        {validationError ? (
          <Text style={{ color: 'red'}}>{validationError}</Text>
        ) : null}
  
        <View style={styles.suggestSection}>
          <Text style={styles.suggestLabel}>Suggest:</Text>
          <View style={styles.chipContainer}>
            {suggestions.map((item, index) => (
              <TouchableOpacity key={index} style={styles.chip} onPress={() => setFamilyName(item)}>
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, loading && { opacity: 0.7 }, !isFormValid && { opacity: 0.7 }]} 
          onPress={handleContinue}
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueText}>Continue</Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    paddingLeft: 10,
    paddingTop: 10, 
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#D48141',
  },
  headerPlaceholder: {
    width: 28,
  },
  content: {
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 25,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 30,
    paddingTop: 50,
  },
  circleOutline: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#D48141',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF5E6',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D48141',
    marginBottom: 10,
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#D48141',
    fontWeight: '600',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#D48141',
  },
  suggestSection: {
    width: '100%',
    marginTop: 20,
  },
  suggestLabel: {
    color: '#D48141',
    fontWeight: '700',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#EBC094',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    padding: 25,
    paddingBottom: 35,
  },
  continueButton: {
    backgroundColor: '#D48141',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputErrorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
});