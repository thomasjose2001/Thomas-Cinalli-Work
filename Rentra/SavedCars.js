/* Component showing saved cars */

/* React native imports */
import { StyleSheet, View, TouchableOpacity, SafeAreaView, StatusBar, Text, FlatList, RefreshControl } from "react-native";

/* Navigation imports */
import { goBack } from "../../../Navigation/navigationRef";

/* Icon imports */
import AntDesign from 'react-native-vector-icons/AntDesign';

/* React imports */
import { useEffect, useState } from "react";

/* Skeleton Placeholder imports */
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/* Component imports */
import firestoreHandler from "../../Handlers/FirestoreHandler";
import CarContainer from "./CarContainer";
import SkeletonLoader from '../SkeletonLoader';

const SavedCars = ( ) => {

    /* State to Manage Loading Status */
    const [ isLoading, setIsLoading ] = useState( true );

    /* State to Store Fetched Posts */
    const [ posts, setPosts ] = useState( [ ] );

    /* State to Manage Refreshing Status */
    const [ refreshing, setRefreshing ] = useState( false );
    
    /* Function to Handle Pull-to-Refresh */
    const onRefresh = ( ) => {

        setRefreshing( true ) ;
        grabPosts( ); 
    };
      
    const grabPosts = async () => {

        try {

            const carIds = await firestoreHandler.getFieldFromDocument('Users', 'me', 'SavedCars');
      
            if (!Array.isArray(carIds) || carIds.length === 0) {

                console.warn('No SavedCars found or field is not an array.');
                setPosts([]);
                return;
            }
      
            const posts = await firestoreHandler.displaySpecificPosts('Cars', carIds);
            setPosts([...posts]);
        } 
        catch (error) {

            console.error('Error fetching posts:', error);
        } 
        finally {

            setIsLoading(false);
            setRefreshing(false);
        };
    };
      
    /* Load data on mount */
    useEffect(() => {

        grabPosts();
    }, []);  

    if ( isLoading ) {

        return (
             
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
    
                <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <AntDesign name="left" size={28} color="#EEE" />
                    </TouchableOpacity>
    
                    <Text style={styles.headerTitle}>Saved Cars</Text>
                </View>
    
                <View style={styles.skeletonBody}>
                    <SkeletonPlaceholder
                        backgroundColor="#1F1F1F"
                        highlightColor="#333333"
                    >
                        <SkeletonPlaceholder.Item flexDirection="column" padding={20}>
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
                </View>
            </SafeAreaView>
        );
    };

    return (

        <SafeAreaView style={styles.container}>

            <StatusBar barStyle="light-content" />

            <View style={styles.topContainer}>
                
                <TouchableOpacity onPress={ ( ) => goBack( ) }>
                    <AntDesign name='left' size={28} color='#EEE' />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Saved Cars</Text>
            </View>

            {/* Body - display cars */}
            { posts.length > 0 ? (

                <View style={styles.body}>

                    <FlatList
                        data={posts} 
                        /* Extract the key for each item */
                        keyExtractor={ ( post, index ) => post.postID || index.toString( ) }
                        showsVerticalScrollIndicator={false}
                        refreshControl={

                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#B0B0B0"
                            />
                        }
                        
                        renderItem={({ item: post }) => (
                            
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
                            screen='carDetails'
                            rentingDays={null}
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
                            />
                        )}
                    />
                </View>

            ) : (

               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.empty}>
                        <View style={[styles.fake, { opacity: 0.9 }]}>
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
            
                        <Text style={styles.emptyTitle}>No Saved Cars</Text>
            
                        <Text style={styles.emptyDescription}>
                            Press on the bookmark icon on any car container on the home screen to save a car
                        </Text>
                    </View>
               </View>                  
            ) }
        </SafeAreaView>     
    );   
};

export default SavedCars;

const styles = StyleSheet.create( { 

    container: {
        flex: 1,
        backgroundColor: '#090909',
    },
    skeletonWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#090909',
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
    body: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 50,
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
} );
