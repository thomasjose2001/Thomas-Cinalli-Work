/* Bottom sheet login screen */

/* React native imports */
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Keyboard, TouchableWithoutFeedback, SafeAreaView, Platform, ActivityIndicator } from 'react-native';

/* React imports */
import { useEffect, useState, useContext } from 'react';

/* Icon imports */
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

/* Navigation imports */
import { goBack, navigate } from '../../Navigation/navigationRef';

/* Component imports */
import googleHandler from '../../Authentication/Handlers/GoogleHandler';
import phoneHandler from '../../Authentication/Handlers/PhoneHandler';
import authenticationHandler from '../../Authentication/Handlers/AuthHandler';
import signInWithApple from '../../Authentication/Handlers/AppleHandler';

/* Cloud functions imports */
import { firebaseFunctions } from '../../FirebaseConfiguration/Configuration';

/* Context imports */
import GeneralContext from '../../Context/Context';

/* Area code imports */
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

const LoginScreen = ( ) => {

    /* Send verification function */
    const { sendSmsVerification } = phoneHandler( );

    /* State to hold phone number */
    const [ phoneNumber, setPhoneNumber ] = useState( '' );

    /* Context state */
    const { isUsersFirstTime, setHasOpenedLoginBanner } = useContext( GeneralContext );

    /* State for choosing country/area code */
    const [ country, setCountry ] = useState( null );

    /* State to show area code modal */
    const [ visible, setVisible ] = useState( false );

    /* Loading state for button */
    const [ loading, setLoading ] = useState( false );

    /* Handle google push sign in */
    const handleGoogleSignIn = async ( ) => {

        const signInResult = await googleHandler.googleSignIn( );
    
        if ( signInResult ) {

            /* Check if the user is signing in for the first time */
            const { isFirstTime, uid } = await authenticationHandler.checkCurrentUser( );
        
            if ( !isFirstTime ) {

                /* Change signInStatus to true */
                await firebaseFunctions.httpsCallable('setSignInTrue')({uid: uid});
            }

            console.log( 'this is isFirstTime: ', isFirstTime );
        };
    };

    /* Handle apple sign in */
    const handleAppleSignIn = async( ) => {

        const signInResult = await signInWithApple( );

        if ( signInResult ) {

            /* Check if the user is signing in for the first time */
            const { isFirstTime, uid } = await authenticationHandler.checkCurrentUser( );
        
            if ( !isFirstTime ) {

                /* Change signInStatus to true */
                await firebaseFunctions.httpsCallable('setSignInTrue')();
            }

            console.log( "Apple Sign-In Check:", { isFirstTime, uid } );
            console.log( 'this is isFirstTime: ', isFirstTime );

            if ( isFirstTime ) {

                console.log( "Navigating to Name screen (First-time user)" );
                navigate( "Name" );
            } 
            else {

                console.log( "Navigating to Main screen (Returning user)" );
                navigate( "Main" );
            };
        };
    };

    /* Handle the Next button press */
    const handleSendVerification = async () => {
        if (!phoneNumber.trim()) return; // Prevent empty submissions

        const fullPhoneNumber = `+${country ? country.callingCode : '506'}${phoneNumber}`;  
        setLoading(true); // Show loader

        try {

            await sendSmsVerification(fullPhoneNumber); // Send verification code
            navigate('Otp', { phoneNumber: fullPhoneNumber }); // Navigate to OTP screen
        } 
        catch (error) {

            console.error('Error sending SMS:', error);
        } 
        finally {

            setLoading(false); // Hide loader after completion
        }
    };

    /* Set context state to true ( so that login screen doesn't keep appearing when signing in for the first time ) */
    useEffect( ( ) => { 

        setHasOpenedLoginBanner( true );

    }, [ ] )

    return ( 

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.wrapper}>

                <View style={styles.content}>
                    

                    <Text style={styles.headerText}>
                        Continue using your phone number
                    </Text>

                    <View style={styles.phoneInputContainer}>

                        <TouchableOpacity 
                            style={styles.countryCodeContainer} 
                            onPress={() => setVisible(true)}
                        >
                            <Text style={styles.countryCodeText}>
                                {country ? `+${country.callingCode}` : '+506'}
                            </Text> 
                            <AntDesign name="down" size={18} color="#9b9b9b" style={styles.dropdownIcon} />
                        </TouchableOpacity>

                        {/* Country Picker Modal */}
                        <CountryPicker
                            visible={visible}
                            theme={DARK_THEME}
                            withFlag
                            withCallingCode
                            placeholder={''}                      
                            withFilter
                            onSelect={(country) => {
                                setCountry(country);
                                setVisible(false);
                            }}
                            onClose={() => setVisible(false)}
                        />

                        <TextInput 
                            style={styles.phoneInput}
                            placeholder="Phone number" 
                            placeholderTextColor="#A4A4A4" 
                            keyboardType="numeric" 
                            onChangeText={setPhoneNumber}
                            value={phoneNumber}
                        />
                    </View>

                    <Text style={styles.subHeaderText}>
                        A confirmation code will be sent to your phone number. Message and data rates may apply.
                    </Text>

                    {/* Button with ActivityIndicator */}
                    <TouchableOpacity 
                        style={[
                            styles.button, 
                            (!phoneNumber.trim() || loading) && styles.disabledButton
                        ]} 
                        onPress={handleSendVerification} 
                        disabled={!phoneNumber.trim() || loading} // Disable if empty or loading
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Next</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.buttonsContainer}>
                        
                        <TouchableOpacity style={styles.otherButtons} onPress={ handleGoogleSignIn }>
                            <AntDesign name="google" size={22} color="#fff" style={styles.iconStyle} />
                            <Text style={styles.otherButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        { Platform.OS === 'ios' &&

                            <TouchableOpacity style={styles.otherButtons} onPress={ handleAppleSignIn }>
                                <AntDesign name="apple1" size={22} color="#EEE" style={styles.iconStyle} />
                                <Text style={styles.otherButtonText}>Continue with Apple</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;

const styles = StyleSheet.create ( {

    wrapper: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        marginTop: 20,
        paddingHorizontal: 30,
    },
    footer: {
        flex: 1,
        marginBottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerText: {
        marginTop: 10,
        color: '#EEE',
        fontSize: 32,
        fontWeight: '600',
    },
    subHeaderText: {
        marginTop: 20,
        color: '#A4A4A4',
        fontWeight: '400',
        fontSize: 13,
    },
    button: {
        marginTop: 20,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C73E8',
        borderRadius: 30,
        height: 55,
        width: '100%',
    },
    buttonText: {
        fontSize: 17,
        lineHeight: 26,
        fontWeight: '600',
        color: '#EEE',
    },
    disabledButton: {
        opacity: 0.7,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#888',
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 18,
        color: '#888',
    },
    buttonsContainer: { 
        paddingBottom: 80, 
        gap: 18,
        width: '100%',   
    },
    otherButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        borderColor: '#616161',
        borderWidth: 2,
        borderRadius: 30,
        height: 55,
    },
    otherButtonText: {
        color: '#EEE',
        fontWeight: '500',
        fontSize: 17,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 10,
        padding: 4,
    },
    countryCodeContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#A4A4A4',
        padding: 6,    
    },
    countryCodeText: {
        color: '#A4A4A4',
        fontSize: 16,
    },
    dropdownIcon: {
        marginLeft: 5,
    },
    phoneInput: {
        width: '60%',
        paddingLeft: 4,
        borderBottomWidth: 2,
        borderBottomColor: '#A4A4A4',
        color: '#EEE',
        fontSize: 17,
    },
} );
