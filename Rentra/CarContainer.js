/* Component showing the container with the car */

/* React native imports */
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, Image, Dimensions, Alert } from 'react-native';

/* Fast image imports */
import FastImage from 'react-native-fast-image';

/* Navigation imports */
import { navigate } from '../../../Navigation/navigationRef';

/* React imports */
import { useState, useContext, useMemo } from 'react';

/* Icon imports */
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/* Context imports */
import GeneralContext from '../../../Context/Context';

/* Width of screen */
const { width } = Dimensions.get( 'window' );

const CarContainer = ( { id, name, nameId, make, model, location, imgs, price, year, mileage, type, doors, description, screen, rentingDays, numberOfTrips, locationName, lat, long, totalRating, Ratings, drive, seats, alternativeLocation, alternativeLocationPrice, isAlternativeLocationMatch } ) => {

    /* Context states */
    const { savedCars, toggleBookmark, isSignedIn } = useContext( GeneralContext );

    /* Check if car id is in the saved cars list ( if the user is signed out, turn all bookmarks off ) */
    const isBookmarked = isSignedIn ? savedCars.includes( id ) : false;

    /* State to track active image index */
    const [ activeIndex, setActiveIndex ] = useState( 0 ); 
    
    /* Handle When User Clicks on Activity Container */
    const handleCarClick = ( ) => {

        navigate( 'CarDetails', {

            id,
            name,
            nameId,
            make,
            model,
            location,
            imgs,
            price,
            year,
            mileage,
            type,
            doors,
            description,
            screen,
            rentingDays,
            numberOfTrips,
            locationName,
            lat, 
            long,
            totalRating,
            Ratings,
            drive,
        } );
    };

    /* Handle Scroll Event */
    const handleScroll = ( event ) => {

      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const calculatedIndex = Math.floor( contentOffsetX / 350 );

      /* Clamp the index to stay within valid bounds */
      const clampedIndex = Math.max( 0, Math.min( calculatedIndex, imgs.length - 1 ) );
      setActiveIndex( clampedIndex );     
    };

    /* UseEffect to convert province names */
    const province = useMemo(() => {
        switch (location) {
            case 'San José':
            case 'San José Province':
            case 'Provincia de San José':
                return 'Provincia de San José';
            case 'Cartago':
            case 'Cartago Province':
            case 'Provincia de Cartago':
                return 'Provincia de Cartago';
            case 'Heredia':
            case 'Heredia Province':
            case 'Provincia de Heredia':
                return 'Provincia de Heredia';
            case 'Alajuela':
            case 'Alajuela Province':
            case 'Provincia de Alajuela':
                return 'Provincia de Alajuela';
            case 'Guanacaste':
            case 'Guanacaste Province':
            case 'Provincia de Guanacaste':
                return 'Provincia de Guanacaste';
            case 'Limón':
            case 'Limón Province':
            case 'Provincia de Limón':
                return 'Provincia de Limón';
            case 'Puntarenas':
            case 'Puntarenas Province':
            case 'Provincia de Puntarenas':
                return 'Provincia de Puntarenas';
            default:
                return 'Outside Costa Rica';
        }
    }, [location]);    

    return (

        screen === 'carDetails' ? ( 

            <TouchableOpacity onPress={handleCarClick} activeOpacity={1} style={styles.card}>

                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        style={styles.scrollView}
                        pagingEnabled
                        scrollEventThrottle={16}
                    >
                        {imgs.map((img, index) => (
                            <TouchableOpacity key={index} onPress={handleCarClick} activeOpacity={1}>
                                <FastImage resizeMode="cover" source={{ uri: img }} style={styles.cardImg} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.paginationDots}>
                        {imgs.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeIndex === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.cardTopPills}>
                        <View style={styles.cardTopPill}>
                            <Text style={styles.cardTopPillText}>${price}/day</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.primaryValue}>
                        {make} {model} - {year}
                    </Text>

                    {/* Bookmark button with absolute positioning */}
                    <TouchableOpacity 
                        onPress={ ( ) => {

                            if ( isSignedIn ) {

                                toggleBookmark( id );
                            } 
                            else {

                                navigate( 'LoginScreen' );
                            }
                        } } 
                        style={styles.bookmarkIcon}
                    >
                        <MaterialIcons 
                            name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                            size={32} 
                            color='#CCC' 
                        />
                    </TouchableOpacity> 

                    <View style={styles.row}>
                        <View style={{ flexDirection: 'row', gap: 8, paddingLeft: 2 }}>
                            <FontAwesome name="map-marker" size={14} color="#B0B0B0" />
                            <Text style={styles.secondaryValue}>{province}</Text>
                        </View>
                    </View>

                    {Array.isArray(alternativeLocation) && alternativeLocation.length > 0 && (
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                            <FontAwesome name="location-arrow" size={14} color={isAlternativeLocationMatch ? '#1C73E8' : '#B0B0B0'} />
                            <Text style={[
                                styles.secondaryValue,
                                { 
                                    paddingLeft: 2, 
                                    color: isAlternativeLocationMatch ? '#1C73E8' : '#B0B0B0', 
                                    fontWeight: isAlternativeLocationMatch ? 'bold' : 'normal' 
                                }
                            ]}>
                                {isAlternativeLocationMatch 
                                    ? `Alternative location match` 
                                    : 'Additional locations'}                            
                            </Text>
                        </View>
                    )}

                    <View style={styles.row}>
                        <View style={styles.subRow}>

                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                <MaterialCommunityIcons name="car-cog" size={14} color="#B0B0B0" />
                                <Text style={styles.secondaryValue}>{drive}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                <FontAwesome name="star" size={14} color="#d9ae0a" />
                                <Text style={styles.secondaryValue}>{totalRating}</Text>
                            </View>

                            <Text style={styles.secondaryValue}>{numberOfTrips} Trips</Text>
                        </View>
                    </View>
        
                    <View style={styles.row}>
                        <Text style={styles.ternaryValue}>
                            Total: ${price * rentingDays}
                            {isAlternativeLocationMatch && (
                                <Text style={{ color: '#888'}}>
                                    {isAlternativeLocationMatch && ` + $${alternativeLocationPrice} (if alt. location chosen)`}
                                </Text>
                            )}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

        ) : screen === 'carDetailsFromMap' ? (
            
            <View style={{ height: 160}}>
                <TouchableOpacity
                    onPress={handleCarClick}
                    activeOpacity={1}
                    style={[styles.card, { flexDirection: 'row' }]}
                >
                    <View>
                        <TouchableOpacity onPress={handleCarClick} activeOpacity={1}>
                            <FastImage
                            resizeMode="cover"
                            source={{ uri: imgs[0] }}
                            style={{ width: 150, height: 110, borderRadius: 2 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.cardBody, {paddingHorizontal: 10}]}>
                        <Text numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontSize: 15,
                                fontWeight: '800',
                                color: '#EEE',
                                marginTop: 10,
                                maxWidth: 180,
                                overflow: 'hidden',
                            }}
                        >
                            {make} {model} - {year}
                        </Text>

                        <View style={styles.row}>
                            <View style={{ flexDirection: 'row', gap: 8, paddingLeft: 2 }}>
                                <FontAwesome name="map-marker" size={14} color="#B0B0B0" />
                                <Text style={styles.secondaryValue}>{province}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.subRow}>
                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                <MaterialCommunityIcons name="car-cog" size={14} color="#B0B0B0" />
                                <Text style={styles.secondaryValue}>{drive}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                <FontAwesome name="star" size={14} color="#d9ae0a" />
                                <Text style={styles.secondaryValue}>{totalRating}</Text>
                            </View>

                            <Text style={styles.secondaryValue}>{numberOfTrips} Trips</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            { isAlternativeLocationMatch ? (
                                <Text style={styles.ternaryValue}>
                                    {`Price: $${price} + $${alternativeLocationPrice} (alt. location)`}
                                </Text>
                             
                            ) : (
                                <Text style={styles.ternaryValue}>
                                    {`Price: $${price}`}
                                </Text>
                            )} 
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
    
        ) : (

            <TouchableOpacity onPress={handleCarClick} activeOpacity={1} style={styles.card}>

                <View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        style={styles.scrollView}
                        pagingEnabled
                        scrollEventThrottle={16}
                    >
                        {imgs.map((img, index) => (

                            <TouchableOpacity key={index} onPress={handleCarClick} activeOpacity={1}>
                                <Image resizeMode="cover" source={{ uri: img }} style={styles.cardImg2} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.paginationDots}>
                        {imgs.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeIndex === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.cardBody2}>

                    <View style={styles.row}>
                        <Text style={styles.primaryValue}>
                            {make} {model} - {year}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.subRow}>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <FontAwesome name="map-marker" size={14} color="#B0B0B0" />
                                <Text style={styles.secondaryValue}>{province}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.subRow}>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <MaterialCommunityIcons name="car-cog" size={14} color="#B0B0B0" />
                                <Text style={styles.secondaryValue}>{drive}</Text>
                            </View>

                            <Text style={styles.secondaryValue}>{numberOfTrips} Trips</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.subRow}>
                            
                            <View style={{ flexDirection: 'row', gap: 3 }}>
                                <Text style={styles.secondaryValue}>{seats}</Text>
                                <MaterialCommunityIcons name="car-seat" size={14} color="#B0B0B0" />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 3 }}>
                                <FontAwesome name="star" size={14} color="#d9ae0a" />
                                <Text style={styles.secondaryValue}>{totalRating}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>

                        {rentingDays ? (
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Text style={styles.ternaryValue}>Total: ${price * rentingDays}</Text>
                            </View>
                        ) : (
                            <Text style={styles.ternaryValue}>Price: ${price}</Text>
                        ) }
                    </View>
                </View>
            </TouchableOpacity>
        )
    );
};

export default CarContainer;

const styles = StyleSheet.create( {

    card: {
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: '#000',
        borderRadius: 8,
    },
    cardImg: {
        height: 230,
        width: width - 40,
        borderRadius: 4,
    },
    cardImg2: {
        height: 230,
        width: width - 40,
    },
    scrollView: {
        width: '100%',
    },
    paginationDots: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{ translateX: -50 }], /* Center align dots horizontally */
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        height: 6,
        width: 6,
        borderRadius: 5,
        backgroundColor: '#888',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#FFF',
        width: 6,
        height: 6,
    },
    cardBody: {
        position: 'relative',
        paddingHorizontal: 2,
        paddingBottom: 15,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#000',
        borderBottomLeftRadius: 12,  
        borderBottomRightRadius: 12,
    },    
    cardBody2: {
        position: 'relative',
        paddingVertical: 3,
        paddingHorizontal: 10,
        paddingBottom: 15,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#000',
        borderBottomLeftRadius: 12,  
        borderBottomRightRadius: 12,
    },
    bookmarkIcon: {
        position: 'absolute',
        top: 10,
        right: 1,
    },    
    row: {
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subRow: {
        flexDirection: 'row',
        gap: 5,
    },
    primaryValue: {
        marginTop: 8,
        marginBottom: 3,
        fontSize: 19,
        fontWeight: '800',
        color: '#EEE',
    },
    secondaryValue: {
        fontSize: 11,
        fontWeight: '500',
        color: '#B0B0B0',
    },
    ternaryValue: {
        fontSize: 10,
        fontWeight: '500',
        color: '#B0B0B0',
    },
    cardTopPills: {
        position: 'absolute',
        right: 0,
        bottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    cardTopPill: {
        height: 32,
        paddingHorizontal: 10,
        backgroundColor: '#1C73E8',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTopPillText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
} );
