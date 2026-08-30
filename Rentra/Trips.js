/* Component showing car trips */

/* React native imports */
import { StyleSheet, Image, Text, SafeAreaView, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';

/* Navigation imports */
import { goBack, navigate } from '../../../Navigation/navigationRef';

/* React imports */
import { useEffect, useState } from 'react';

/* Fast image imports */
import FastImage from 'react-native-fast-image';

/* Icon imports */
import AntDesign from 'react-native-vector-icons/AntDesign';

/* Component imports */
import firestoreHandler from '../../Handlers/FirestoreHandler';
import SkeletonLoader from '../SkeletonLoader';

/* Skeleton Placeholder imports */
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Trips = ( )  => {

    /* State to Manage Loading Status */
    const [ isLoading, setIsLoading ] = useState( true );

    /* State to Store Fetched Posts */
    const [ posts, setPosts ] = useState( [ ] );

    /* State for chosen tab */
    const [ tabValue, setTabValue ] = useState( 0 );

    /* State to Manage Refreshing Status */
    const [ refreshing, setRefreshing ] = useState( false );

    /* State for current trips */
    const [ currentTrips, setCurrentTrips ] = useState( [ ] );
    
    /* State for past trips */
    const [ pastTrips, setPastTrips ] = useState( [ ] );

    const items = [

        { name: 'Current Trips' },
        { name: 'Past Trips' },
    ];

    /* UseEffect to grab trirps and info */
    useEffect( ( ) => {

        grabPosts( );
    }, [ ] );

    const grabPosts = async ( isRefresh = false ) => {

        try {

            /* Only show skeleton on first load */
            if ( !isRefresh ) setIsLoading( true );
        
            const [ fetchedCurrent, fetchedPast ] = await Promise.all( [ 

                firestoreHandler.displayMyTrips( 'Trips' ),
                firestoreHandler.displayMyTrips( 'PastTrips' ),
            ] );
        
            setCurrentTrips( fetchedCurrent );
            setPastTrips( fetchedPast );

            console.log("Tab value:", tabValue);
            console.log("CurrentTrips:", currentTrips.length, "PastTrips:", pastTrips.length);

        } 
        catch ( error ) {

            console.log( 'Error loading trips:', error );
        } 
        finally {

            setIsLoading( false );
        };
    }; 

    /* Function to Handle Pull-to-Refresh */
    const onRefresh = async ( ) => {

        /* Set Loading Animation */
        setRefreshing( true );

        /* Fetch Data From Firestore */
        await grabPosts( true ); 

        /* Turn Off Loading Animation */
        setRefreshing( false ); 
    };

    if ( isLoading ) {

        return (
            
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.content}>
                    
                    {/* Header - always visible */}
                    <View style={styles.topContainer}>
                        <TouchableOpacity onPress={() => goBack()}>
                            <AntDesign name="left" size={28} color="#EEE" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Trips</Text>
                    </View>
            
                    {/* Skeleton body */}
                    <View style={{flex: 1, marginTop: 5}}>
                        <SkeletonPlaceholder backgroundColor="#1F1F1F" highlightColor="#333333">
                            <SkeletonPlaceholder.Item flexDirection="column" padding={15}>
                            <SkeletonLoader width="50%" height={20} borderRadius={10} style={{ marginBottom: 30 }} />
                            <SkeletonLoader width="100%" height={160} borderRadius={10} style={{ marginBottom: 10 }} />
                            <SkeletonLoader width="80%" height={20} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="70%" height={15} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="60%" height={15} borderRadius={10} style={{ marginBottom: 30 }} />
                            <SkeletonLoader width="100%" height={160} borderRadius={10} style={{ marginBottom: 10 }} />
                            <SkeletonLoader width="80%" height={20} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="70%" height={15} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="60%" height={15} borderRadius={10} style={{ marginBottom: 30 }} />
                            <SkeletonLoader width="100%" height={160} borderRadius={10} style={{ marginBottom: 10 }} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </SafeAreaView>
        );
    } 

    return ( 

        <SafeAreaView style={styles.wrapper}>

            <View style={styles.content}>

                <View style={styles.topContainer}>
    
                    <TouchableOpacity onPress={ ( ) => goBack( ) }>
                        <AntDesign name='left' size={28} color='#EEE' />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>My Trips</Text>
                </View>

                <View style={styles.tabs}>
                    {items.map(({ name }, index) => {
                        const isActive = index === tabValue;
                        return (
                        <TouchableOpacity
                            key={name}
                            onPress={() => {
                                setTabValue(index);
                            }}  
                                style={styles.tabsItemWrapper}>
                            <View style={styles.tabsItem}>
                            <Text
                                style={[
                                    styles.tabsItemText,
                                    isActive && { color: '#1C73E8' },
                                ]}>
                                {name}
                            </Text>
                            </View>
                            {isActive && <View style={styles.tabsItemLine} />}
                        </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Body */}
                { ( tabValue === 0 ? currentTrips.length : pastTrips.length ) > 0 ? (
                    <View style={styles.body}>

                        <FlatList
                            data={tabValue === 0 ? currentTrips : pastTrips}
                            /* Extract the key for each item */
                            keyExtractor={ ( post, index ) => post.tripID || index.toString( ) }
                            showsVerticalScrollIndicator={false}
                            refreshControl={

                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor="#B0B0B0"
                                />
                            }
                            
                            renderItem={({ item: post }) => {
                                
                                return ( 

                                    <TouchableOpacity style={styles.tripContainer} onPress={ ( ) => { 

                                        navigate( 'TripDetails', {
                                            
                                            img: post.img,
                                            id: post.id,
                                            name: post.name,
                                            nameId: post.nameId,
                                            make: post.make,
                                            model: post.model,
                                            description: post.description,
                                            year: post.year,
                                            startDate: post.startDate,
                                            endDate: post.endDate,
                                            pickupTime: post.pickupTime,
                                            dropOffTime: post.dropOffTime,
                                            locationName: post.locationName,
                                            lat: post.lat,
                                            long: post.long,
                                            tripID: post.tripID,
                                        } )
                                    } }>
                                        <FastImage 
                                            style={styles.img}
                                            source={{ uri: post.img }}
                                        />

                                        <View style={styles.overlay} />

                                        <Text style={styles.tripContainerTitle}>
                                            {post.make} {post.model}
                                        </Text>

                                        <Text style={styles.tripContainerSubTitle}>
                                            {post.year}
                                        </Text>

                                        <Text style={styles.tripContainerDateTitle}>
                                            {post.startDate} at {post.pickupTime} 
                                        </Text>
                                    </TouchableOpacity>
                                )
                            } }
                        />
                    </View>

                ) : (

                    <View style={styles.empty}>
                        <View style={styles.fake}>
                            <View style={styles.fakeCircle} />

                            <View>
                                <View style={[styles.fakeLine, { width: 120 }]} />
                                <View style={styles.fakeLine} />
                                <View style={[styles.fakeLine, { width: 70, marginBottom: 0 }]} />
                            </View>
                        </View>

                        <View style={[styles.fake, { opacity: 0.5 }]}>
                            <View style={styles.fakeCircle} />
                                
                                <View>
                                    <View style={[styles.fakeLine, { width: 120 }]} />
                                    <View style={styles.fakeLine} />
                                    <View style={[styles.fakeLine, { width: 70, marginBottom: 0 }]} />
                                </View>
                        </View>

                        <Text style={styles.emptyTitle}>No Trips</Text>

                        <Text style={styles.emptyDescription}>
                            Purchase a rent and you'll see your trip here
                        </Text>
                    </View>
                ) }
            </View>
        </SafeAreaView>
    );
};

export default Trips;

const styles = StyleSheet.create( {

    skeletonWrapper: {
        flex: 1,
        backgroundColor: '#000',
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
    },
    headerTitle: {
        paddingLeft: 5,
        fontSize: 32,
        fontWeight: '700',
        color: '#EAEAEA',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#EAEAEA',
        paddingLeft: 15,
    },
    body: {
        flex: 6,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    tabsItemWrapper: {
        marginRight: 28,
    },
    tabsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 4,
    },
    tabsItemText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        color: '#7b7c7e',
    },
    tabsItemLine: {
        width: 20,
        height: 3,
        backgroundColor: '#1C73E8',
        borderRadius: 24,
    },
    empty: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100,
        paddingHorizontal: 25,
    },
    emptyTitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
        marginTop: 12,
    },
    emptyDescription: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '400',
        color: '#8c9197',
        textAlign: 'center',
    },
    fake: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    fakeCircle: {
        width: 44,
        height: 44,
        borderRadius: 9999,
        backgroundColor: '#e8e9ed',
        marginRight: 16,
    },
    fakeLine: {
        width: 200,
        height: 10,
        borderRadius: 4,
        backgroundColor: '#626262',
        marginBottom: 8,
    },
    tripContainer: {
        overflow: 'hidden',
        height: 200,
        width: '100%',
        marginBottom: 25,
        borderRadius: 10,
        position: 'relative',
    },
    img: {
        height: '100%',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    tripContainerTitle: {
        position: 'absolute',
        bottom: 45,
        left: 10,
        fontSize: 26,
        color: '#EEE',
        fontWeight: '700',
    },
    tripContainerSubTitle: {
        position: 'absolute',
        bottom: 25,
        left: 10,
        fontSize: 14,
        color: '#AAA',
        fontWeight: '500',
    },
    tripContainerDateTitle: {
        position: 'absolute',
        bottom: 25,
        right: 15,
        fontSize: 14,
        color: '#AAA',
        fontWeight: '500',
    },
} );
