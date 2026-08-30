/* Home screen */

/* React native imports */
import { StyleSheet, TouchableOpacity, Dimensions, Text, SafeAreaView, View, FlatList, RefreshControl, StatusBar, Image, KeyboardAvoidingView, Platform } from 'react-native';

/* Navigation imports */
import { navigate } from '../../Navigation/navigationRef';

/* Internet imports */
import NetInfo from '@react-native-community/netinfo';

/* React imports */
import { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';

/* Icon imports */
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

/* Safe area imports */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* Component imports */
import firestoreHandler from '../Handlers/FirestoreHandler';
import { firebaseAuth } from '../../FirebaseConfiguration/Configuration';
import realTimeHandler from '../Handlers/RealTimeHandler';
import syncPhoneToken from '../Utils/PhoneTokenChecker';

import CarContainer from './Cars/CarContainer';
import Filters from '../Filters/Filters';
import SkeletonLoader from './SkeletonLoader';

import Doors from '../Filters/Doors';
import Drive from '../Filters/Drive';
import Seats from '../Filters/Seats';
import Make from '../Filters/Make';
import Price from '../Filters/Price';
import Type from '../Filters/Type';
import Years from '../Filters/Years';

/* Bottom sheet imports */
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet/src";

/* Skeleton Placeholder imports */
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/* Context imports */
import GeneralContext from '../../Context/Context';

/* Animation imports */
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

const Home = ( ) => {

    /* State to Store Fetched Posts */
    const [ posts, setPosts ] = useState( [ ] );

    /* State to Manage Loading Status */
    const [ isLoading, setIsLoading ] = useState( true );

    /* State to Manage Refreshing Status */
    const [ refreshing, setRefreshing ] = useState( false );

    /* State for chosen filter */
    const [ filter, setFilter ] = useState( null );

    /* State containing next screen when pressing car container */
    const [ screen, setScreen ] = useState( 'carDetails' );

    /* State for keeping amount of days the user wants to rent */
    const [ amountOfDays, setAmountOfDays ] = useState( 1 );

    /* State for keeping filter loading */
    const [ loadingFilteredPosts, setLoadingFilteredPosts ] = useState( false );

    /* State for making filters toucahble */
    const [ filtersUnlocked, setFiltersUnlocked ] = useState( true );

    /* State for showing skeleton loader */
    const [ showSkeleton, setShowSkeleton ] = useState( false );

    /* State for showing if dropdown is active or not  */
    const [ isDropdownOpen, setIsDropdownOpen ] = useState( false );

    /* Placeholder for searched location */
    const [ tempLocationData, setTempLocationData ] = useState( null );

    const [ tempStartDate, setTempStartDate ] = useState(null);
    
    const [ tempEndDate, setTempEndDate ] = useState(null);

    const [ tempStartTime, setTempStartTime ] = useState(null);
    
    const [ tempEndTime, setTempEndTime ] = useState(null);

    /* State for checking if there is internet connection */
    const [ isConnected, setIsConnected ] = useState( true );

    /* State to check if timeout time for loading was exceeded */
    const [ loadTimeoutExceeded, setLoadTimeoutExceeded ] = useState( false );

    /* State for updating expanded searchbar location */
    const [ expandedSearchbarLocation, setExpandedSearchbarLocation ] = useState( 'No location selected' );

    const [resetKey, setResetKey] = useState(0);

    const [showFlatList, setShowFlatList] = useState(false);

    const flatListRef = useRef(null);

    /* Filter bottom sheet reference */
    const bottomSheetRef = useRef( null );

    /* Screen width */
    const screenWidth = Dimensions.get( 'window' ).width;

    /* references of already cached images */
    const prefetchedImages = useRef( new Set( ) );
    
    /* Context state */
    const { notificationCount, setNotificationCount, hasOpenedLoginBanner, startDate, setStartDate, endDate, setEndDate, setUsersFirstTime, formatDateWithDays, isSignedIn, setPickupTime, setDropOffTime, filterCriteria, setFilterCriteria, appliedFilters, setAppliedFilters, selectedPrice, setSelectedPrice, selectedMake, setSelectedMake, selectedType, setSelectedType, selectedYears, setSelectedYears, selectedSeats, setSelectedSeats, selectedDrive, setSelectedDrive, selectedDoors, setSelectedDoors, selectedLocationType, setSelectedLocationType, currentLocation, setCurrentLocation, } = useContext( GeneralContext );

    /* Opacity */
    const opacity = useSharedValue( 0 );
    const darkOverlayOpacity = useSharedValue( 0 );
    const dropdownOverlayOpacity = useSharedValue( 0 );

    /* Dropdown height */
    const dropdownHeight = useSharedValue( 0 );
    const dropdownWidth = useSharedValue(0);
    const dropdownLeft = useSharedValue( screenWidth / 2 );

    /* Get safe area insets */
    const insets = useSafeAreaInsets( ); 

    /* OnRefresh for flatlist */
    const onRefresh = async ( ) => {

        setRefreshing (true );
        
        try {

            /* Fetch new data */
            await fetchFilteredPosts( filterCriteria );
            setFilterCriteria(prev => ({ ...prev }));
        } 
        catch ( error ) {

            console.error( 'Error during refresh:', error );
        } 
        finally {

            setRefreshing( false );
        };
    };

    const animatedStyle = useAnimatedStyle( ( ) => {

        return {

            opacity: opacity.value,
        };
    } );

    /* Toggle searchbar */
    const toggleDropdown = ( ) => {

        const openConfig = {

          damping: 28,
          stiffness: 500,
          mass: 0.8,
          overshootClamping: false,
        };
      
        const closeConfig = {

          damping: 20,
          stiffness: 10,
          mass: 0.5,
          overshootClamping: true,
        };
      
        if (isDropdownOpen) {

            dropdownHeight.value = withSpring(0, closeConfig);
            dropdownOverlayOpacity.value = withTiming(0, { duration: 150 });
            dropdownWidth.value = withSpring(0, closeConfig);
            dropdownLeft.value = withSpring(screenWidth / 2, closeConfig);
            setIsDropdownOpen(false);

        } 
        else {

            dropdownHeight.value = withSpring(305, openConfig);
            dropdownOverlayOpacity.value = withTiming(0.5, { duration: 150 });
            dropdownWidth.value = withSpring(screenWidth, openConfig);
            dropdownLeft.value = withSpring(0, openConfig);
            setIsDropdownOpen(true);
        }
    };  

    const animatedDropdownStyle = useAnimatedStyle( ( ) => {

        return {

          height: dropdownHeight.value,
          width: dropdownWidth.value,
          left: dropdownLeft.value,
        };
    } );      
      
    const dropdownOverlayStyle = useAnimatedStyle( ( ) => {

        return {

            opacity: dropdownOverlayOpacity.value,
        };
    } );
    
    useEffect( ( ) => {

        /* Animate opacity to 1 smoothly over 200ms */
        opacity.value = withTiming( 1, { duration: 200 } );
    }, [ ] );

    /* Sync phone token */
    useEffect( ( ) => {

        syncPhoneToken( );
    }, [ ] );

    /* Internet listener */
    useEffect( ( ) => {

        if ( isLoading ) {

            const timeout = setTimeout( ( ) => {

                setLoadTimeoutExceeded( true );
            }, 20000 ); /* 20 seconds of no response */
    
            return ( ) => clearTimeout( timeout );
        } 
        else {

            setLoadTimeoutExceeded( false );
        }
    }, [ isLoading ] );    
    
    /* Function to prefetch images */
    const prefetchImages = async ( postsData ) => {

        try {

            const firstFew = postsData.slice( 0, 4 );
            const imageUris = firstFew.flatMap( post => post.imgs.slice( 0, 1 ) );
    
            const newUris = imageUris.filter( uri => !prefetchedImages.current.has( uri ) );
            newUris.forEach( uri => prefetchedImages.current.add( uri ) );
    
            await Promise.all( newUris.map( uri => Image.prefetch( uri ) ) );
    
            console.log( "Prefetched new images:", newUris );
        } 
        catch ( error ) {

            console.error( "Prefetch error:", error );
        };
    };
    
    /* Function to collapse the bottom sheet back */
    const collapseBottomSheet = ( ) => {

        if ( bottomSheetRef.current ) {
                
            bottomSheetRef.current.close( );
            setFilter( null );
        };
    };
    
    /* Function to display chosen filter content */
    const selectedFilter = ( ) => {

        switch( filter ) {

            case 1: 
                return (
                    <Make 
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedMake}
                        setSelectedOption={setSelectedMake}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    />
                )
            case 2:
                return (
                    <Price 
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedPrice}
                        setSelectedOption={setSelectedPrice}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    /> 
                )
            case 3: 
                return (
                    <Type 
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedType}
                        setSelectedOption={setSelectedType}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    />
                )
            case 4:
                return (
                    <Years 
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedYears}
                        setSelectedOption={setSelectedYears}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    />
                )
            case 5:
                return (
                    <Seats 
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedSeats}
                        setSelectedOption={setSelectedSeats}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    />
                )   
            case 6:
                return (
                    <Drive 
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedDrive}
                        setSelectedOption={setSelectedDrive}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    />
                ) 
            case 7:
                return (
                    <Doors
                        applyFilter={applyFilter}
                        collapseBottomSheet={collapseBottomSheet}
                        selectedOption={selectedDoors}
                        setSelectedOption={setSelectedDoors}
                        loadingFilteredPosts={loadingFilteredPosts}
                        filtersUnlocked={filtersUnlocked}
                    />
                );       
        };
    };

    /* Method to fetch posts with filters */
    const applyFilter = async (criteria) => {

        try {

            setFiltersUnlocked(false); // lock UI
            setLoadingFilteredPosts(true);

            setPosts([]); 
    
            const updatedCriteria = { ...filterCriteria, ...criteria };
    
            await fetchFilteredPosts(updatedCriteria);
    
            setFilterCriteria(updatedCriteria);
            setAppliedFilters((prev) => ({ ...prev, ...criteria }));
    
            /* Add delay before unlocking filters and showing results */
            setTimeout(() => {

                setLoadingFilteredPosts(false);
                setFiltersUnlocked(true); // unlock filters after delay
            }, 1200);
    
        } 
        catch (error) {

            console.error('Error applying filter:', error);
            setLoadingFilteredPosts(false);
            setFiltersUnlocked(true); // fallback unlock
        }
    };    

    /* Helper function to update UI with filter change */
    const fetchFilteredPosts = async (criteria, skipLoadingReset = false) => {

        try {

          const filteredPosts = await firestoreHandler.displayPosts(criteria, startDate, endDate, currentLocation);
      
          if (Array.isArray(filteredPosts) && filteredPosts.length > 0) {

            setPosts((prevPosts) => {
              const shouldUpdate = JSON.stringify(prevPosts) !== JSON.stringify(filteredPosts);
              if (shouldUpdate) prefetchImages(filteredPosts);
              return shouldUpdate ? filteredPosts : prevPosts;
            });
          } 
          else {

            setPosts([]);
          }
          return filteredPosts;
        } catch (error) {
          console.error('Error fetching filtered posts:', error);
          setPosts([]);
          return [];
        } finally {
          if (!skipLoadingReset) {
            setLoadingFilteredPosts(false);
          }
        }
    };
      
    const resetFilters = async ({ onlyDates = false, onlyLocation = false } = {}) => {

        try {

            if (!onlyDates && !onlyLocation) {
                setFilter(null);
            }
    
            setLoadingFilteredPosts(true);
            setShowSkeleton(true);
    
            // Reset relevant states
            if (!onlyDates && !onlyLocation) {
                setExpandedSearchbarLocation('No location selected');
                setAppliedFilters({});
                setFilterCriteria({});
                setSelectedLocationType(null);
                setSelectedPrice([0, 500]);
                setSelectedMake(null);
                setSelectedType(null);
                setSelectedYears([2010, 2025]);
                setSelectedSeats(null);
                setSelectedDrive(null);
                setSelectedDoors(null);
                setTempLocationData(null);
                setCurrentLocation(null);
            }
    
            if (onlyDates || (!onlyDates && !onlyLocation)) {
                setTempStartDate(null);
                setTempEndDate(null);
                setTempStartTime(null);
                setTempEndTime(null);
                setStartDate(null);
                setEndDate(null);
                setPickupTime(null);
                setDropOffTime(null);
            }
    
            if (onlyLocation || (!onlyDates && !onlyLocation)) {
                setTempLocationData(null);
                setCurrentLocation(null);
                setExpandedSearchbarLocation('No location selected');
            }
    
            let updatedPosts;
    
            if (!onlyDates && !onlyLocation) {
                await new Promise(resolve => setTimeout(resolve, 50));
                updatedPosts = await firestoreHandler.displayPosts({}, null, null, null);
            } else {
                updatedPosts = await firestoreHandler.displayPosts({}, null, null, onlyLocation ? null : currentLocation);
            }
    
            let cleanedPosts;
            if (!onlyDates && !onlyLocation) {
                cleanedPosts = updatedPosts.map(post => ({
                    ...post,
                    isAlternativeLocationMatch: false,
                    alternativeLocationPrice: 0,
                }));
            } else {
                cleanedPosts = updatedPosts; // Keep what FirestoreHandler already set
            }
    

            setPosts( cleanedPosts ); 
            
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
                setResetKey(prev => prev + 1);
            }, 100);              

            if (!onlyDates && !onlyLocation) {
                setFilterCriteria({});
            }
        } catch (error) {
            console.error('Reset filters failed:', error);
            setPosts([]);
        } finally {
            setLoadingFilteredPosts(false);
            setShowSkeleton(false);
        }
    };    

    const timeoutPromise = ( promise, ms = 10000 ) =>

        Promise.race( [

            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), ms)
            ),
        ] );
      
      
    /* UseEffect to grab the amount of renting days ( cannot use formatDateWithDays function because it creates an infinite loop error ) */
    useEffect( ( ) => {

        if ( startDate && endDate ) {

            const [ startYear, startMonth, startDay ] = startDate.split( '-' );
            const [ endYear, endMonth, endDay ] = endDate.split( '-' );
    
            const start = new Date( startYear, startMonth - 1, startDay );
            const end = new Date( endYear, endMonth - 1, endDay );
    
            const differenceInDays = Math.round( ( end - start ) / ( 1000 * 60 * 60 * 24 ) );
    

            setAmountOfDays( differenceInDays );
        }
        else {

            setAmountOfDays( 1 );
        }
    }, [ startDate, endDate ] );

    const fetchData = useCallback( async ( ) => {

        try {
            
            //setIsLoading( true );
            setLoadTimeoutExceeded( false );
        
            const result = await timeoutPromise( fetchFilteredPosts( filterCriteria ), 10000 );
        } 
        catch ( error ) {

            console.error( 'Fetch error or timeout:', error );
        } 
        finally {

            setIsLoading( false );
        }
    }, [ filterCriteria, startDate, endDate ] );      
    
    /* Call fetchData inside a useEffect when component mounts and when filters change */
    useEffect( ( ) => {

        fetchData( );
    }, [ filterCriteria, startDate, endDate ] );

    /* Listener for auto retrying if there is signal */
    useEffect( ( ) => {

        const unsubscribe = NetInfo.addEventListener( state => {

            const hasInternet = !!state.isConnected && !!state.isInternetReachable;
          
            setIsConnected( hasInternet );
      
            if ( hasInternet && isLoading ) {

                fetchData( ); /* Auto-retry if we recover signal mid-load */
            }
        } );
      
        return () => unsubscribe( );
        
    }, [ isLoading, fetchData ] );  
    
    /* UseEffect to animate blur opacity */
    useEffect( ( ) => {

        darkOverlayOpacity.value = withTiming( filter ? 0.4 : 0, { duration: 300 } );

    }, [ filter ] );
    
    const animatedDarkOverlayStyle = useAnimatedStyle( ( ) => ( {

        opacity: darkOverlayOpacity.value,
    } ) );
 
    /* UseEffect for keeping track of notification count */
    useEffect(() => {
        const uid = firebaseAuth.currentUser?.uid;
        if (!isSignedIn || !uid) return;
    
        const unsubscribe = realTimeHandler.listenForNotifications(uid, (count) => {
            setNotificationCount(count);
        });
    
        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [isSignedIn, firebaseAuth.currentUser?.uid]);    

    /* UseEffect for skeletion loader */
    useEffect( ( ) => {

        if ( isLoading ) {

          const timer = setTimeout( ( ) => setShowSkeleton( true ), 50 );
          return ( ) => clearTimeout( timer );
        } 
        else {

          setShowSkeleton( false );
        }
    }, [ isLoading ] );

    const renderCarContainer = useCallback(({ item: post }) => (
        <CarContainer
            id={post.postID}
            name={post.UserName}
            nameId={post.UserId}
            make={post.make}
            model={post.model}
            location={post.province}
            imgs={post.imgs}
            price={post.price}
            year={post.year}
            mileage={post.mileage}
            type={post.type}
            doors={post.doors}
            description={post.description}
            screen={screen}
            rentingDays={amountOfDays}
            numberOfTrips={post.numberOfTrips}
            locationName={post.locationName}
            lat={post.location[0]}
            long={post.location[1]}
            totalRating={post.totalRating}
            Ratings={post.Ratings}
            drive={post.drive}
            seats={post.seats}
            alternativeLocation={post.alternativeLocation}
            alternativeLocationPrice={post.alternativeLocationPrice}
            isAlternativeLocationMatch={post.isAlternativeLocationMatch}
            expandedSearchbarLocation={expandedSearchbarLocation}
        />
    ), [ screen, amountOfDays ] );      

    const filteredPosts = useMemo( ( ) => 
        posts.filter( post => post.UserId !== firestoreHandler?.user?.uid ), [ posts ]
    );    

    /* Skeleton loading screen */
    if (isLoading && showSkeleton) {

        return (

            <SafeAreaView style={styles.skeletonWrapper}>
                <Animated.View style={[animatedStyle]}>
                    <SkeletonPlaceholder
                        backgroundColor="#141414"
                        highlightColor="#333"
                    >
                        <SkeletonPlaceholder.Item flexDirection="column" paddingHorizontal={20}>

                            <SkeletonLoader width="100%" height={50} borderRadius={30} style={{ marginBottom: 15, marginTop: 10 }} />

                            <SkeletonPlaceholder.Item 
                                flexDirection="row" 
                                justifyContent="space-between" 
                                marginBottom={35}
                            >
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <SkeletonPlaceholder.Item 
                                        key={index} 
                                        alignItems="center"
                                    >
                                        <SkeletonLoader width={30} height={30} borderRadius={20} />
                                        <SkeletonLoader width={40} height={8} borderRadius={4} style={{ marginTop: 10 }} />
                                    </SkeletonPlaceholder.Item>
                                ))}
                            </SkeletonPlaceholder.Item>

                            <SkeletonLoader width="100%" height={200} borderRadius={10} style={{ marginBottom: 10 }} />

                            <SkeletonLoader width="80%" height={20} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="70%" height={15} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="60%" height={15} borderRadius={10} style={{ marginBottom: 30 }} />
                            <SkeletonLoader width="100%" height={200} borderRadius={10} style={{ marginBottom: 10 }} />

                            <SkeletonLoader width="80%" height={20} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="70%" height={15} borderRadius={10} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="60%" height={15} borderRadius={10} style={{ marginBottom: 30 }} />
                            <SkeletonLoader width="100%" height={200} borderRadius={10} style={{ marginBottom: 10 }} />

                            <SkeletonLoader width="100%" height={40} borderRadius={10} style={{ marginBottom: 30 }} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                </Animated.View>
            </SafeAreaView>
        );
    };
        
    return ( 
        <>
            <SafeAreaView style={styles.wrapper}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
    
                {/* Background blur when filter is active */}
                <Animated.View style={[styles.darkOverlay, animatedDarkOverlayStyle]} />

                {/* Touchable Overlay to close BottomSheet */}
                {filter && (
                    <TouchableOpacity 
                        style={styles.overlay} 
                        activeOpacity={1} 
                        onPress={collapseBottomSheet} 
                    />
                )}
            
                {/* Top Container */}
                {!isLoading && (

                    <View style={styles.topContainer}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                            <TouchableOpacity style={styles.searchBar} onPress={toggleDropdown}>
                                <Feather name="search" size={25} color="#797979" />
                                <View style={styles.searchBarContainer}>
                                    <Text 
                                        style={[styles.searchBarText, { flexShrink: 1 }]}
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                    >       
                                        {expandedSearchbarLocation}
                                    </Text>

                                    <Text style={[styles.searchBarSubText, {marginTop: 1}]}>
                                        {startDate && endDate ? formatDateWithDays(startDate, endDate) : "No Date Selected"}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => isSignedIn ? navigate('Trips') : navigate('LoginScreen')}>
                                <FontAwesome5 name='suitcase' size={26} color='#CCC' />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.notificationButton} onPress={() => navigate('Notifications')}>
                                <Ionicons name='notifications' size={28} color='#CCC' />
                                {notificationCount !== 0 && (
                                    <View style={styles.notificationCountContainer}>
                                        <Text style={{ color: '#EEE', fontSize: 14, fontWeight: 'bold' }}>
                                            {notificationCount}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
        
                            <TouchableOpacity onPress={() => isSignedIn ? navigate('SavedCars') : navigate('LoginScreen')}>
                                <MaterialIcons name='bookmark' size={28} color='#CCC' />
                            </TouchableOpacity>
                        </View>
        
                        {/* Filters scroll view */}
                        <Filters setFilter={setFilter} appliedFilters={appliedFilters} resetFilters={resetFilters} />
                    </View>
                )}
    
                {/* Body */}
                {/* Skeleton loader below filters when fetching data */}
                {loadingFilteredPosts || !filtersUnlocked ? (
                    <View style={styles.body}>
                        <SkeletonPlaceholder backgroundColor="#141414" highlightColor="#333">
                            <SkeletonPlaceholder.Item flexDirection="column">
                                
                                <SkeletonLoader width="100%" height={200} borderRadius={10} style={{ marginBottom: 10 }} />

                                <SkeletonLoader width="80%" height={20} borderRadius={10} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width="70%" height={15} borderRadius={10} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width="60%" height={15} borderRadius={10} style={{ marginBottom: 30 }} />
                                <SkeletonLoader width="100%" height={200} borderRadius={10} style={{ marginBottom: 10 }} />

                                <SkeletonLoader width="80%" height={20} borderRadius={10} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width="70%" height={15} borderRadius={10} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width="60%" height={15} borderRadius={10} style={{ marginBottom: 30 }} />
                                <SkeletonLoader width="100%" height={200} borderRadius={10} style={{ marginBottom: 10 }} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>
                ) : ( 

                    <View style={styles.body}>
                        {((!isLoading && filteredPosts.length === 0) || loadTimeoutExceeded) && (
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={styles.topMsg}>
                                    No Internet Connection
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setLoadingFilteredPosts(true);
                                        setFiltersUnlocked(false);
                                        fetchData().finally(() => {
                                            setFiltersUnlocked(true);
                                        });
                                    }}
                                    
                                style={{ marginTop: 10 }}>
                                <Text style={{ color: '#1C73E8', fontWeight: '600', fontSize: 16 }}>
                                    Retry
                                </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={{ flex: 1, backgroundColor: '#000' }}>
                            <FlatList
                                key={`flatlist-${resetKey}`}
                                ref={flatListRef}
                                data={filteredPosts}
                                keyExtractor={(item, index) => item?.postID?.toString() || `fallback-${index}`}
                                renderItem={renderCarContainer}
                                ListHeaderComponent={() =>
                                filteredPosts.length > 0 ? (
                                    <Text style={[styles.carAvailableMsg, { marginBottom: 10 }]}>
                                    Cars Available: {filteredPosts.length}
                                    </Text>
                                ) : null
                                }
                                extraData={filter}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B0B0B0" />
                                }
                                initialNumToRender={5}
                                maxToRenderPerBatch={5}
                                windowSize={10}
                                updateCellsBatchingPeriod={50}
                            />
                        </View>
                    </View>
                ) }
            </SafeAreaView>   


            {/* BottomSheet for filters to appear */}
            {filter && (
                <BottomSheet
                    ref={bottomSheetRef}
                    enableDynamicSizing={true}
                    enablePanDownToClose={true}
                    enableHandlePanningGesture={true} 
                    enableContentPanningGesture={false}
                    topInset={insets.top}
                    backgroundStyle={{ backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: '#090909' }}
                    handleIndicatorStyle={{ backgroundColor: '#444', width: 50 }}
                    onAnimate={(fromIndex, toIndex) => {
                        if (toIndex === -1) {
                            darkOverlayOpacity.value = withTiming(0, { duration: 100 });
                        }
                    }}
                    onChange={(index) => {
                        if (index === -1) {
                            collapseBottomSheet();
                        }
                    }}
                >
                    <BottomSheetView style={{ height: '100%', paddingHorizontal: 20 }}>
                        {selectedFilter()}
                    </BottomSheetView>
                </BottomSheet>
            )}

            {/* Dropdown Overlay */}
            {isDropdownOpen && (
                <>
                    {/* Dark overlay */}
                    <Animated.View 
                        pointerEvents="none"
                        style={[
                            StyleSheet.absoluteFill,
                            { backgroundColor: 'black', zIndex: 100 },
                            dropdownOverlayStyle
                        ]}
                    />

                    {/* Touchable only ABOVE dropdown to close */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={toggleDropdown}
                        style={[
                            StyleSheet.absoluteFill,
                        ]}
                    >
                        <Animated.View
                            style={[{ flex: 1 }, dropdownOverlayStyle]}
                        />
                    </TouchableOpacity>

                    {/* Dropdown content */}
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: 48,
                                backgroundColor: '#000',
                                zIndex: 102,
                                borderBottomLeftRadius: 25,
                                borderBottomRightRadius: 25,
                                overflow: 'hidden',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderWidth: 1,
                                borderColor: '#000',
                            },
                            animatedDropdownStyle,
                        ]}
                        >
                            <TouchableOpacity onPress={toggleDropdown}>
                                <Feather name='x' size={24} color='#EEE' style={{marginBottom: 10, paddingLeft: 5}} />
                            </TouchableOpacity>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                                <Text style={{paddingHorizontal: 10, paddingBottom: 10, color: '#777', fontSize: 14, fontWeight: '500'}}>
                                    Location
                                </Text>

                                <TouchableOpacity 
                                    onPress={async () => {
                                        await resetFilters({ onlyLocation: true });
                                    }}
                                >
                                    <Text style={{textDecorationLine: 'underline', paddingHorizontal: 10, paddingBottom: 10, color: '#1C73E8', fontSize: 14, fontWeight: '500'}}>
                                        Reset
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={{justifyContent: 'center', width: '100%', height: 40, backgroundColor: '#131313', paddingHorizontal: 16, paddingTop: 2, color: '#333', borderRadius: 20, borderWidth: 1, borderColor: '#131313' }}
                                onPress={() =>
                                    navigate('LocationSearchBar', {
                                        onSelect: (selectedLocationData) => {
                                            setTempLocationData(selectedLocationData);
                                        }
                                    })
                                }        
                            >
                                <Text 
                                    style={{color: '#EEE', fontSize: 14, fontWeight: '500', paddingTop: 2}}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {tempLocationData?.locationName ?? 'No location selected'}
                                </Text>
                            </TouchableOpacity>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                                <Text style={{paddingHorizontal: 10, paddingBottom: 10, color: '#777', fontSize: 14, fontWeight: '500'}}>
                                    Dates
                                </Text>

                                <TouchableOpacity 
                                    onPress={async () => {
                                        await resetFilters({ onlyDates: true });
                                    }}
                                >
                                    <Text style={{ textDecorationLine: 'underline', paddingHorizontal: 10, paddingBottom: 10, color: '#1C73E8', fontSize: 14, fontWeight: '500' }}>
                                        Reset
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={{justifyContent: 'center', width: '100%', height: 40, backgroundColor: '#131313', paddingHorizontal: 16, paddingTop: 2, color: '#333', borderRadius: 20, borderWidth: 1, borderColor: '#131313' }}
                                onPress={() =>
                                    navigate('RentDates', {
                                        id: null,
                                        nextStep: 'none',
                                        onSelect: ({ tempStartDate, tempEndDate, tempPickupTime, tempDropOffTime }) => {
                                          setTempStartDate(tempStartDate);
                                          setTempEndDate(tempEndDate);
                                          setTempStartTime(tempPickupTime);
                                          setTempEndTime(tempDropOffTime);
                                          
                                        },
                                        initialTempStartDate: tempStartDate,
                                        initialTempEndDate: tempEndDate,
                                        initialTempPickupTime: tempStartTime,
                                        initialTempDropOffTime: tempEndTime,
                                    })
                                }  
                            >
                                
                                <Text style={{color: '#EEE', fontSize: 14, fontWeight: '500', paddingTop: 2}}>
                                    {tempStartDate && tempEndDate
                                        ? formatDateWithDays(tempStartDate, tempEndDate)
                                        : (startDate && endDate
                                            ? formatDateWithDays(startDate, endDate)
                                            : "No Date Selected"
                                            )
                                    }
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={async () => {
                                    if (tempLocationData) {
                                    setExpandedSearchbarLocation(tempLocationData.locationName);
                                    setCurrentLocation([
                                        tempLocationData.location.latitude,
                                        tempLocationData.location.longitude
                                    ]);
                                    }

                                    if (tempStartDate && tempEndDate) {
                                        setStartDate(tempStartDate);
                                        setEndDate(tempEndDate);
                                    }
                                      
                                    if (tempStartTime && tempEndTime) {
                                        setPickupTime(tempStartTime);
                                        setDropOffTime(tempEndTime);
                                    }  

                                    await applyFilter({});
                                }}

                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 40,
                                    marginTop: 35,
                                    borderRadius: 30,
                                    backgroundColor: '#1C73E8',
                                    borderWidth: 1,
                                    borderColor: '#1C73E8',
                                    marginBottom: 12
                                }}
                                >
                                <Text style={{ fontSize: 16, lineHeight: 26, fontWeight: '600', color: '#EEE' }}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                    </Animated.View>
                </>
            )}
        </>
    );    
};

export default Home;

const styles = StyleSheet.create ( {

    skeletonWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#000',
        paddingHorizontal: 20,
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#000',
        overflow: 'visible',
        paddingBottom: 0,
    },
    topContainer: {
        height: 103,
        paddingHorizontal: 20,
    },  
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 10,
    },    
    blurView: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        zIndex: 1,
    },      
    searchBarContainer: {
        flex: 1,
        maxWidth: '100%',
        
    },    
    searchBar: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        width: '65%', 
        borderWidth: 2, 
        borderColor: '#131313', 
        backgroundColor: '#131313',
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        
        borderRadius: 24,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // Shadow for Android
        elevation: 5,
    },
    searchBarText: {
        color: '#797979', 
        fontSize: 12, 
        fontWeight: '700',
    },
    searchBarSubText: {
        color: '#656565', 
        fontSize: 11, 
        fontWeight: '500',
    },
    notificationButton: {
        position: 'relative',
    },  
    notificationCountContainer: {
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        right: -10,
        top: -10,
        height: 18,
        width: 22,
        borderRadius: 999,
        backgroundColor: '#E33008',
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 12,
    },
    topMsg: {
        color: '#EEE',
        fontSize: 22,
        fontWeight: '600',
    },
    carAvailableMsg: {
        marginTop: 3,
        paddingHorizontal: 5,
        color: '#EEE',
        fontSize: 19,
        fontWeight: '600',
    },
    mapButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        height: 48, 
        paddingHorizontal: 12,
        borderRadius: 24,
        borderWidth: 2, 
        borderColor: '#1F1F1F', 
        backgroundColor: '#1F1F1F',
    },
    mapButtonText: {
        color: '#AAA',
        fontSize: 15,
        fontWeight: '700',
    },
} );
