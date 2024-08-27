// Manages backend and interaction with Firebase Database

import { auth, db, storage } from '../firebase.js';
import { doc, getDoc, getDocs, setDoc, addDoc, FieldValue, serverTimestamp, collection, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser, verifyBeforeUpdateEmail, sendEmailVerification } from 'firebase/auth';
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

const Model = {

    auth: auth,
    
    signup: async ( email, password, data ) => {

        try {

            // Create the user in the authentication service
            const userCredential = await createUserWithEmailAndPassword( auth, email, password );
            await setDoc( doc( db, "userData", Model.auth.currentUser.uid ), data );

            return "success";
    
        } catch ( error ) {

            return error;
        }
    },

    login: async ( email, password ) => {

        try {

            // Login User with its email & password
            const userCredential = await signInWithEmailAndPassword( auth, email, password );
            
            // User is signed in, update the last login timestamp
            const lastLoginTime = serverTimestamp( );
            await setDoc( doc( db, "userData/" + userCredential.user.uid ),
            
            { lastLogin: lastLoginTime }, 
            { merge: true } );

            return "success";

        } catch ( error ) {

            return error;
        }
    },

    logout: async ( ) => {

        try {

            await signOut( Model.auth );
            return "success";

        } catch ( error ) {

            return error;
        }
    },

    deleteAccount: async ( ) => {

        try {

            await deleteUser( auth.currentUser );
            return "success";

        } catch ( error ) {

            return error;
        }
    },

    changeEmail: async ( email ) => {

        try {

            await verifyBeforeUpdateEmail( auth.currentUser, email );
            return "success";
        
        } catch ( error ) {

            return error;
        }
    },

    verifyEmail: async ( ) => {

        try {

            await sendEmailVerification( auth.currentUser );
            return "success";
        
        } catch ( error ) {

            return error;
        }
    },

    fetchData: async ( path ) => {

        try {

            const docRef = doc( db, path );
            const docSnapshot = await getDoc( docRef );
            
            if ( docSnapshot.exists( ) ) {

                const data = docSnapshot.data();
                
                //return data that came back from the database
                return data;
          
            } 
            
            else {
                console.log( 'Document does not exist' );
            }

        } catch ( error ) {

          console.error( 'Error fetching document:', error );
        }
    },

    postData: async ( path, data ) => {

        try {

            await setDoc( doc( db, path ), data );
        } catch ( error ) {

            console.log( error );
        }
    },

    uploadMedia: async ( firebasePath, file ) => {

        const storageRef = ref( storage, firebasePath );
        
        try {

            console.log( "Uploading Image..." );
            const result = await uploadBytes( storageRef, file );
            
            return "success";
        
        } catch ( error ) {

            console.log( error.message )
            return error;
        }
    },

    fetchMedia: async ( firebasePath ) => {

        const storageRef = storage.ref();
        const imageRef = storageRef.child( firebasePath ); // Path to your image in storage
  
        try {

          const url = await imageRef.getDownloadURL();
          return url;
        
        } catch ( error ) {

          console.error( "Failed to fetch image", error );
        }
    },

    fetchDocIds: async ( firebasePath ) => {

        const collectionRef = collection( db, firebasePath );

        try {

            const snapshot = await getDocs( collectionRef );
            const documents = snapshot.docs.map( doc => ({ id: doc.id }) );

            console.log( "Fetched documents:", documents );
            return documents;
        
        } catch ( error ) {

            console.error( "Error fetching documents:", error );
        }
    },

    fetchAllDocs: async ( firebasePath ) => {

        const collectionRef = collection( db, firebasePath );

        try {

            const snapshot = await getDocs( collectionRef );
            const parts = firebasePath.split( '/' );
            const documents = snapshot.docs.map( doc => ({ name: parts[ 1 ] + "/" + doc.id, data: doc.data() }) );

            return documents;

        } catch ( error ) {

            console.error( "Error fetching documents:", error );
        }
    },

    fetchAllImages: async ( firebasePath ) => {

        const storageRef = ref( storage, firebasePath );

        try {

            const result = await listAll( storageRef );
            
            const imageDetailsPromises = result.items.map( async itemRef => {

                const url = await getDownloadURL( itemRef );
                const parts = firebasePath.split( '/' );

                return { name: parts[ 1 ] + "/" + itemRef.name, url: url };
            } );

            const imageDetails = await Promise.all( imageDetailsPromises );
        
            return imageDetails;
            
        } catch ( error ) {

            console.error( "Error fetching image details:", error );
            return [ ];
        }
    },

    storeAlert: async ( category, province, canton, maxPrice, minPrice, currency, rentOrSale, otherEmail ) => {

        let cat;
        switch( category ) {

            case "House":
                cat = "Casas"
                break;
            case "Lot":
                cat = "lote";
                break;
            case "Room":
                cat = "cuarto";
                break;
            case "Apartment":
                cat = "apartamento";
                break;
        }
        
        try {

            // Add a new document with specified fields in collection "alerts"
            const docRef = await addDoc( collection( db, "alerts" ), {

            Categoria: cat,
            Province: province,
            Canton: canton,
            MaxPrice: Number( maxPrice ),
            MinPrice: Number( minPrice ),
            currency: currency,
            rentOrSale: rentOrSale,
            Email: auth.currentUser.email,
            otherEmail: otherEmail,
            Timestamp: serverTimestamp( ) // sets the timestamp when the document is created
            } );
      
            console.log( "Document written with ID: ", docRef.id );
            return true;

        } catch ( e ) {

            console.error( "Error adding document: ", e );
            return false;
        }
    },

    deleteDocument: async ( collectionPath, docId ) => {

        try {

            await deleteDoc( doc( db, collectionPath, docId ) );
            console.log( 'Document successfully deleted!' );

        } catch ( error ) {

            console.error( 'Error removing document: ', error );
        }
    },

    modifyDocument: async ( collectionName, docId, fieldName, fieldValue ) => {

        const docRef = db.collection( collectionName ).doc( docId );
      
        try {

          // Get the document
          const doc = await docRef.get( );

          if ( doc.exists ) {
          
            // Document exists, set or update the field
            await docRef.update( {

              [ fieldName ]: fieldValue
            } );

          } 
          else {
            
            // Document does not exist, create the field
            await docRef.set( {

              [ fieldName ]: fieldValue
            } );

            console.log( 'Document created with new field' );
          }
        } catch ( error ) {

          console.error( 'Error modifying or creating the field: ', error );
        }
    }
}

export default Model;
