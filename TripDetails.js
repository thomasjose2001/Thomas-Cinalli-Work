/* Component to display trip details */

/* React native imports */
import { StyleSheet, Image, Text, SafeAreaView, View, TouchableOpacity, FlatList, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';

/* Fast image imports */
import FastImage from 'react-native-fast-image';

/* Icon imports */
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

/* Navigation imports */
import { goBack, navigate } from '../../../Navigation/navigationRef';

/* Component imports */
import storageHandler from '../../Handlers/StorageHandler';
import firestoreHandler from '../../Handlers/FirestoreHandler';
import realTimeHandler from '../../Handlers/RealTimeHandler';

/* React imports */
import { useEffect, useState } from 'react';

const TripDetails = ( { route } ) => {

    /* State containing request */
    const [ userImg, setUserImg ] = useState( null );

    /* User rating state */
    const [ userRating, setUserRating ] = useState( '5.0' );

    /* User joined date */
    const [ userJoined, setUserJoined ] = useState( null );

    /* Expanded what to expect text state */
    const [ expandedExpectations, setExpandedExpectations ] = useState( false );

    /* Loading state */
    const [ loading, setLoading ] = useState( true );

    /* Params from Trips */
    const { img, id, name, nameId, make, model, description, year, startDate, endDate, pickupTime, dropOffTime, locationName, lat, long, tripID } = route.params;

    const formatDate = (dateString) => {
        
        const [year, month, day] = dateString.split('-'); // "2025-04-14"
        const date = new Date(year, month - 1, day); // This treats it as local
    
        const options = { month: 'short', day: 'numeric' };
        let formattedDate = date.toLocaleDateString('en-US', options);
    
        const dayNum = date.getDate();
    
        let suffix = 'th';
        if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = 'st';
        else if (dayNum === 2 || dayNum === 22) suffix = 'nd';
        else if (dayNum === 3 || dayNum === 23) suffix = 'rd';
    
        return formattedDate.replace(/\d+/, dayNum + suffix);
    };    

    useEffect( ( ) => { 

        const grabData = async( ) => { 

            try {
                /* Grab user image */
                setUserImg( await storageHandler.grabSpecificCarImg( 'Users', nameId ) );

                /* Grab user rating */
                setUserRating( await firestoreHandler.getFieldFromDocument( 'Users', nameId, 'rating' ) );

                /* Grab user join date */
                setUserJoined( await firestoreHandler.getFieldFromDocument( 'Users', nameId, 'joined' ) );

                setLoading( false );
            }
            catch( error ) {

                console.error( error );
            }
        };

        grabData( );

    }, [ ] );

    if ( loading ) {

        return (
            <SafeAreaView style={styles.wrapperLoading}>
                <ActivityIndicator size="large" color="#fff" />      
            </SafeAreaView>
        );
    };

    return ( 

        <SafeAreaView style={styles.wrapper}>

            <View style={styles.content}>

                <View style={styles.topContainer}>
                    
                    <TouchableOpacity onPress={ ( ) => goBack( ) }>
                        <AntDesign name='left' size={24} color='#EEE' />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Trip Details
                    </Text>

                    <AntDesign name='left' size={24} color='#141414' />
                </View>

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                    <View style={styles.basicInfoContainer}>
                        <View style={styles.imgContainer}>
                            <FastImage
                                style={styles.img}
                                source={{uri: img}}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>

                        <View style={{gap: 2}}>
                            <Text style={styles.basicInfo}>
                                {name}'s {make}
                            </Text>

                            <Text style={styles.basicInfoSecondary}>
                                #{tripID}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tripOption}>

                        <View style={[styles.leftContainer, {alignItems: 'center'}]}>
                            
                            <View style={{flexDirection: 'row', gap: 10}}>
                                
                                <View style={{gap: 3}}>
                                    <Text style={styles.leftContainerHeader}>
                                        Dates
                                    </Text>
                                    
                                    <Text style={styles.leftContainersubHeader}>
                                        {formatDate(startDate)} at {pickupTime} - {formatDate(endDate)} at {dropOffTime}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.tripOption} onPress={ ( ) => navigate( 'TripMappedLocation', { lat: lat, long: long } ) }>

                        <View style={[styles.leftContainer, {alignItems: 'center'}]}>
                            
                            <View style={{flexDirection: 'row', gap: 10}}>
                                
                                <View style={{gap: 3}}>
                                    <Text style={styles.leftContainerHeader}>
                                        Pickup and Drop-off Location
                                    </Text>
                                    
                                    <Text style={styles.leftContainersubHeader}>
                                        {locationName}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <AntDesign name='right' size={18} color='#999' />
                    </TouchableOpacity>

                    <View style={styles.line}></View>

                    <TouchableOpacity style={styles.tripOption} onPress={ ( ) => navigate( 'CarNotes', { description } ) }>

                        <View style={[styles.leftContainer, {alignItems: 'center'}]}>
                            
                            <MaterialCommunityIcons name='notebook' size={28} color='#EEE' />

                            <View style={{flexDirection: 'row', gap: 10}}>
                                
                                <View style={{gap: 3}}>
                                    <Text style={styles.leftContainerHeader}>
                                        Car Notes
                                    </Text>
                                    
                                    <Text style={styles.leftContainersubHeader}>
                                        Instructions left by car owner
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <AntDesign name='right' size={18} color='#888' />
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={styles.tripOption} onPress={ ( ) => navigate( 'Modifications', { tripID, nameId, id } ) }>

                        <View style={[styles.leftContainer, {alignItems: 'center'}]}>
                            
                            <FontAwesome5 name='exchange-alt' size={28} color='#EEE' />

                            <View style={{flexDirection: 'row', gap: 10}}>
                                
                                <View style={{gap: 3}}>
                                    <Text style={styles.leftContainerHeader}>
                                        Modify Trip
                                    </Text>
                                    
                                    <Text style={styles.leftContainersubHeader}>
                                        Request a change in pickup/drop-off spot or date
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <AntDesign name='right' size={18} color='#888' />
                    </TouchableOpacity>

                    <View style={styles.line}></View>
                    
                    <View>
                        <View>
                            <Text style={styles.leftContainerHeader}>
                                About Your Host
                            </Text>
                            
                            <View style={styles.hostContainer}>

                                <TouchableOpacity
                                    style={{ position: 'absolute', right: 24, top: 10 }}
                                    onPress={async () => {
                                        if (nameId) {
                                            let chatroomId = await realTimeHandler.findExistingChat(nameId);

                                            if (!chatroomId) {
                                                chatroomId = id; // use the post ID as the fallback chat ID
                                                await realTimeHandler.createChatroom(chatroomId);
                                            }

                                            navigate('ChatScreen', {
                                                id: chatroomId,
                                                name,
                                                nameId,
                                                img: userImg,
                                            });
                                        }
                                    }}
                                    >
                                        <Text style={{ color: '#1C73E8', fontWeight: '600' }}>
                                            Contact
                                        </Text>
                                </TouchableOpacity>


                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>

                                    <View>
                                    {userImg ? (
                                        <FastImage
                                            style={styles.userImgContainer}
                                            source={{ uri: userImg }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                        ) : (
                                        <View style={[styles.userImgContainer, styles.fallbackAvatar]}>
                                            <Text style={styles.fallbackLetter}>
                                            {name?.charAt(0)?.toUpperCase() ?? 'U'}
                                            </Text>
                                        </View>
                                    )}
                                        <View style={styles.ratingContainer}>
                                            <Text style={styles.ratingText}>
                                                {userRating}.0
                                            </Text>

                                            <Entypo name='star' size={13} color='#1C73E8' />
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{fontSize: 13, fontWeight: '600', color: '#EEE'}}>
                                            {name}
                                        </Text>
                                        <Text style={styles.leftContainersubHeader}>
                                            Joined {userJoined}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.leftContainerHeader, {marginTop: 20}]}>
                        What To Expect
                    </Text>

                    <View style={[styles.expectationContainer, { marginBottom: 30 }]}>
            
                        {/* Expand button top right */}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setExpandedExpectations(!expandedExpectations)}>
                                <Text style={{position:'absolute', right: 16, top: 0, color: '#1C73E8', fontWeight: '600'}}>
                                    {expandedExpectations ? 'Hide' : 'Expand'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Trip instructions text */}
                        <Text
                            style={[styles.leftContainersubHeader, {
                                lineHeight: 15,
                                fontSize: 12,
                                color: '#EEE',
                                marginTop: 26,
                            }]}
                            numberOfLines={expandedExpectations ? undefined : 2}
                        >
                            When picking up your rental car, please arrive at the designated location on time. Be sure to bring a valid driver's license, as it may be required for identity verification. The car will be clean and have at least half a tank of fuel. Before you begin your trip, it’s a good idea to do a quick walkaround of the vehicle to check for any existing damage — feel free to take photos for your records. Most cars include basic features like air conditioning, Bluetooth, and USB charging; take a moment to get familiar with the controls before driving off. If you have any questions or concerns during your trip, you can always contact the car owner through the app. Enjoy your ride and drive safely!
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default TripDetails;

const styles = StyleSheet.create ( { 

    wrapper: {
        flex: 1,
        backgroundColor: '#141414',
    },
    wrapperLoading: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        backgroundColor: '#000',
    },
    imgContainer: {
        position: 'relative',
        overflow: 'hidden',
        height: 90,
        width: 105,
        borderRadius: 10,
        marginRight: 2,
    },
    img: {
        height: '100%',
        width: '100%',
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 5,
        paddingHorizontal: 10,
        backgroundColor: '#141414',
        borderBottomWidth: 1,
        borderColor: '#1C1C1C',
        gap: 3,
    },
    title: {
        color: '#EEE',
        fontSize: 26,
        fontWeight: '600',
    },
    basicInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    basicInfo: {
        color: '#EEE',
        fontSize: 16,
        fontWeight: '600',
    },
    basicInfoSecondary: {
        color: '#999',
        fontSize: 11,
        fontWeight: '600',
    },
    line: {
        marginVertical: 10,
        borderWidth: 0.5,
        borderColor: '#0A0A0A',
    },
    body: {
        flex: 1,
        paddingTop: 15,
        paddingHorizontal: 15,
    },
    horizontalOptions: {
        
    },
    tripOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        marginBottom: 10,
        marginTop: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    leftContainerHeader: {
        color: '#EEE',
        fontSize: 14,
        fontWeight: '800',
    },
    leftContainersubHeader: {
        maxWidth: 350,
        color: '#999',
        fontSize: 11,
        fontWeight: '600',
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    rightContainerHeader: {
        color: '#EEE',
        fontSize: 10,
        fontWeight: '600',
    },
    userImgContainer: {
        overflow: 'hidden',
        height: 55,
        width: 55,
        borderRadius: 999,
    },
    hostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        width: '100%',
        marginTop: 10,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: '#0D0D0D',
        borderRadius: 20,
        backgroundColor: '#0D0D0D'
    },
    ratingContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -10,
        left: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: '#0D0D0D',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#0D0D0D',
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EEE',
    },
    expectationContainer: {
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#070707',
        borderRadius: 20,
        backgroundColor: '#070707'
    },
    fallbackAvatar: {
        backgroundColor: '#1C73E8',
        justifyContent: 'center',
        alignItems: 'center',
    },  
    fallbackLetter: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
    },      
} );