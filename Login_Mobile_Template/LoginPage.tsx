import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert, Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WavyHeader from './WavyHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator'; 
import { useForm, Controller } from 'react-hook-form';

import userAuth from '../AuthenticationHandlers/AuthManager';

const LoginPage: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    
    setLoading(true);
    Keyboard.dismiss();

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    reset();
    setLoading(false);

    const { email, password } = data;  // Extract email and password from the form data

    const user = await userAuth.signIn(email, password);

    if (user) {
      navigation.navigate('Congrats');
    }
    else {
      Alert.alert( 'Failed Login' );
    }
  };

  return (
    <>
      {loading && (
        <View style={styles.activityOverflow}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <WavyHeader />
        <View style={styles.wrapper}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Welcome!</Text>
            <Text style={styles.subSignInMsg}>Please Sign In To Your Account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.entry}>
              <Text style={styles.signInLabels}>Email</Text>
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      keyboardType="email-address"
                      placeholder="thomas@example.com"
                      placeholderTextColor="#999999"
                      style={styles.inputBox}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="email"
                  rules={{
                    required: {
                      value: true,
                      message: 'Email address is required.',
                    },
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email address.',
                    },
                  }}
                />
                <Icon name="email" size={24} color="#999999" style={styles.iconStyle} />
              </View>
              {errors.email && (
                <Text style={styles.inputError}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.entry}>
              <Text style={styles.signInLabels}>Password</Text>
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      placeholder="********"
                      placeholderTextColor="#999999"
                      secureTextEntry={true}
                      style={styles.inputBox}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="password"
                  rules={{
                    required: {
                      value: true,
                      message: 'Password is required.',
                    },
                  }}
                />
                <Icon name="lock" size={24} color="#999999" style={styles.iconStyle} />
              </View>
              {errors.password && (
                <Text style={styles.inputError}>{errors.password.message}</Text>
              )}
            </View>

            <View style={styles.formSubmit}>
      
              <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                <View style={styles.signInButton}>
                  <Text style={styles.buttonText}>Sign in</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')} style={{ marginTop: 20 }}>
                <Text style={styles.formFooter}>
                  Not a member? <Text style={{ color: '#3366FF' }}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 6,
    textAlign: "center",
  },
  subSignInMsg: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
  },
  form: {
    width: '100%',
    justifyContent: 'center',
  },
  entry: {
    marginBottom: 20,
  },
  signInLabels: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 12,
  },
  inputBox: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  iconStyle: {
    padding: 10,
    paddingRight: 16,
  },
  formSubmit: {
    width: '100%',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3366FF',
  },
  signInButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: '#3366FF',
    borderColor: '#007aff',
    width: '100%',
  },
  buttonText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  formFooter: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  inputError: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: 'red',
  },
  activityOverflow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
});

export default LoginPage;
