import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Calculator, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function CostCalculatorScreen() {
  const { price, fuel, year } = useLocalSearchParams<{ price?: string, fuel?: string, year?: string }>();
  
  const [purchasePrice, setPurchasePrice] = useState(price || '30000');
  const [annualMileage, setAnnualMileage] = useState('15000');
  const [fuelType, setFuelType] = useState(fuel || 'Benzin');
  const [fuelConsumption, setFuelConsumption] = useState('7.5');
  const [fuelPrice, setFuelPrice] = useState(fuelType === 'Diesel' ? '1.60' : '1.80');
  const [insuranceClass, setInsuranceClass] = useState('SF10');
  const [vehicleAge, setVehicleAge] = useState(year ? (new Date().getFullYear() - parseInt(year)).toString() : '3');
  
  // Results
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [monthlyTax, setMonthlyTax] = useState(0);
  const [monthlyFuel, setMonthlyFuel] = useState(0);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(0);
  const [monthlyDepreciation, setMonthlyDepreciation] = useState(0);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(0);
  const [totalYearlyCost, setTotalYearlyCost] = useState(0);
  
  useEffect(() => {
    // Update fuel price when fuel type changes
    if (fuelType === 'Diesel') {
      setFuelPrice('1.60');
    } else if (fuelType === 'Elektro') {
      setFuelPrice('0.35'); // Price per kWh
    } else {
      setFuelPrice('1.80');
    }
  }, [fuelType]);
  
  useEffect(() => {
    calculateCosts();
  }, [purchasePrice, annualMileage, fuelType, fuelConsumption, fuelPrice, insuranceClass, vehicleAge]);
  
  const calculateCosts = () => {
    const price = parseFloat(purchasePrice) || 0;
    const mileage = parseFloat(annualMileage) || 0;
    const consumption = parseFloat(fuelConsumption) || 0;
    const fuelCost = parseFloat(fuelPrice) || 0;
    const age = parseInt(vehicleAge) || 0;
    
    // Insurance calculation (simplified)
    let insurance = 0;
    switch (insuranceClass) {
      case 'SF35':
        insurance = price * 0.003;
        break;
      case 'SF25':
        insurance = price * 0.004;
        break;
      case 'SF10':
        insurance = price * 0.005;
        break;
      case 'SF5':
        insurance = price * 0.007;
        break;
      case 'SF0':
        insurance = price * 0.01;
        break;
      default:
        insurance = price * 0.005;
    }
    
    // Tax calculation (simplified)
    let tax = 0;
    if (fuelType === 'Benzin') {
      tax = 10 + (consumption * 2);
    } else if (fuelType === 'Diesel') {
      tax = 15 + (consumption * 3);
    } else if (fuelType === 'Elektro') {
      tax = 0;
    } else {
      tax = 12 + (consumption * 2.5);
    }
    
    // Fuel cost calculation
    let fuel = 0;
    if (fuelType === 'Elektro') {
      // For electric, consumption is in kWh/100km
      fuel = (mileage / 100) * consumption * fuelCost / 12;
    } else {
      fuel = (mileage / 100) * consumption * fuelCost / 12;
    }
    
    // Maintenance calculation
    const maintenance = (price * 0.02) / 12 + (age * 10);
    
    // Depreciation calculation
    let depreciation = 0;
    if (age < 3) {
      depreciation = (price * 0.15) / 12;
    } else if (age < 6) {
      depreciation = (price * 0.1) / 12;
    } else if (age < 10) {
      depreciation = (price * 0.07) / 12;
    } else {
      depreciation = (price * 0.05) / 12;
    }
    
    const monthlyTotal = insurance / 12 + tax / 12 + fuel + maintenance + depreciation;
    const yearlyTotal = monthlyTotal * 12;
    
    setMonthlyInsurance(insurance / 12);
    setMonthlyTax(tax / 12);
    setMonthlyFuel(fuel);
    setMonthlyMaintenance(maintenance);
    setMonthlyDepreciation(depreciation);
    setTotalMonthlyCost(monthlyTotal);
    setTotalYearlyCost(yearlyTotal);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Kostenrechner" }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Calculator size={32} color={Colors.primary} />
            <Text style={styles.title}>Fahrzeugkosten berechnen</Text>
            <Text style={styles.subtitle}>Ermittle die monatlichen und jährlichen Kosten für dein Fahrzeug</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fahrzeugdaten</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kaufpreis (€)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={purchasePrice}
                onChangeText={setPurchasePrice}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jährliche Fahrleistung (km)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={annualMileage}
                onChangeText={setAnnualMileage}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kraftstoffart</Text>
              <View style={styles.fuelTypeContainer}>
                {['Benzin', 'Diesel', 'Elektro', 'Hybrid'].map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.fuelTypeButton,
                      fuelType === type && styles.fuelTypeButtonSelected
                    ]}
                    onPress={() => setFuelType(type)}
                  >
                    <Text 
                      style={[
                        styles.fuelTypeText,
                        fuelType === type && styles.fuelTypeTextSelected
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {fuelType === 'Elektro' ? 'Verbrauch (kWh/100km)' : 'Verbrauch (l/100km)'}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fuelConsumption}
                onChangeText={setFuelConsumption}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {fuelType === 'Elektro' ? 'Strompreis (€/kWh)' : 'Kraftstoffpreis (€/l)'}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fuelPrice}
                onChangeText={setFuelPrice}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Versicherungsklasse</Text>
              <View style={styles.pickerContainer}>
                {['SF35', 'SF25', 'SF10', 'SF5', 'SF0'].map((cls) => (
                  <Pressable
                    key={cls}
                    style={[
                      styles.pickerItem,
                      insuranceClass === cls && styles.pickerItemSelected
                    ]}
                    onPress={() => setInsuranceClass(cls)}
                  >
                    <Text 
                      style={[
                        styles.pickerItemText,
                        insuranceClass === cls && styles.pickerItemTextSelected
                      ]}
                    >
                      {cls}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fahrzeugalter (Jahre)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={vehicleAge}
                onChangeText={setVehicleAge}
              />
            </View>
          </View>
          
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Kostenübersicht</Text>
            
            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Versicherung</Text>
                <Text style={styles.resultValue}>{monthlyInsurance.toFixed(2)} €/Monat</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Kfz-Steuer</Text>
                <Text style={styles.resultValue}>{monthlyTax.toFixed(2)} €/Monat</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Kraftstoff</Text>
                <Text style={styles.resultValue}>{monthlyFuel.toFixed(2)} €/Monat</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Wartung & Reparatur</Text>
                <Text style={styles.resultValue}>{monthlyMaintenance.toFixed(2)} €/Monat</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Wertverlust</Text>
                <Text style={styles.resultValue}>{monthlyDepreciation.toFixed(2)} €/Monat</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.resultRow}>
                <Text style={styles.totalLabel}>Monatliche Gesamtkosten</Text>
                <Text style={styles.totalValue}>{totalMonthlyCost.toFixed(2)} €</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.totalLabel}>Jährliche Gesamtkosten</Text>
                <Text style={styles.totalValue}>{totalYearlyCost.toFixed(2)} €</Text>
              </View>
            </View>
            
            <View style={styles.disclaimer}>
              <Info size={16} color={Colors.secondaryText} style={styles.disclaimerIcon} />
              <Text style={styles.disclaimerText}>
                Diese Berechnung dient nur als Orientierung. Die tatsächlichen Kosten können abweichen.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  fuelTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fuelTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fuelTypeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  fuelTypeText: {
    fontSize: 14,
    color: Colors.text,
  },
  fuelTypeTextSelected: {
    color: Colors.background,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pickerItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  pickerItemTextSelected: {
    color: Colors.background,
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  resultValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  disclaimerIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
  },
});