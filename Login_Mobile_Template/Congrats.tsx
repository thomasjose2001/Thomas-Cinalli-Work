import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator'; 

const Congrats: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = (event: GestureResponderEvent) => {

    navigation.navigate('Home');

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3366FF' }}>
      <View style={styles.container}>
        <View style={styles.alert}>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Your Login Was Successful</Text>
          </View>

          <TouchableOpacity onPress={handlePress}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  alert: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  alertContent: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  alertTop: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTopText: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 4,
    color: '#fae4a8',
    textAlign: 'center',
  },
  alertTitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: 44,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
    width: '100%',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3366FF',
  },
});

export default Congrats;
