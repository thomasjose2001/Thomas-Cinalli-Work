// Displays the login screen

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { Alert, Button } from 'antd';

import Model from "../Model/Model.js";
import styles from './Login.module.css';

const LoginForm = ( ) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorStatus, setErrorStatus] = useState(false);
    const [error, setError] = useState("");
    
    // Navigation object
    const navigate = useNavigate( );

    // Handle login button
    const handleLogin = async ( e ) => {

        e.preventDefault( );
        const status = await Model.login( email, password );
        
        if ( status === "success" ) {

            navigate('../mainPage');
        } 
        else {

            setErrorStatus(true);
            setError(handleErrorMessages( status.code ));
        }
    };

    // Error messages when logging in 
    const handleErrorMessages = ( errorMsg ) => {

        if( errorMsg === 'auth/invalid-email' )
            errorMsg = 'Invalid Email';

        else if( errorMsg === 'auth/missing-password' ) 
            errorMsg = 'Missing Password';

        else if( errorMsg === 'auth/invalid-credential' )
            errorMsg = 'Invalid Password';

        else if( errorMsg === 'auth/too-many-requests' )
            errorMsg = 'User has inputted an incorrect Password 6 times! Please change your Password!';

        return errorMsg;
    }

    return (

        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.wrapperImage}>
                    <h5>MyProperty</h5>
                </div>
                <div className={styles.wrapperContent}>
                    <h1>Welcome to <strong>MyProperty</strong></h1>
                    <div className={styles.inputBoxes}>
                        <input type='text' placeholder='email' className={styles.inputField} value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <FaUser className={styles.icon} />
                    </div>
                    <div className={styles.inputBoxes}>
                        <input type='password' placeholder='password' className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <FaLock className={styles.icon} />
                    </div>
                    <div className={styles.buttons}>
                        <button type='sumbit' className={styles.loginButton} onClick={ handleLogin }>Login</button>
                    </div>
                    <div className={styles.links}>
                        <h4 className={styles.forgotLink} onClick={() => navigate('../forgotOptions')}>Forgot Username / Password</h4>
                        <h6 className={styles.SignUp} onClick={() => navigate('../registerForm')}>Create An Account / Sign-Up</h6>
                    </div>
                    <div>
                        { errorStatus ? <Alert message={error} type="error" showIcon action={<Button size="small" onClick={()=>{setErrorStatus(false);}} danger> Close </Button>}/> : <></> }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;