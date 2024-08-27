// Shows the menu list in the home screen

import React from "react";

import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, SettingOutlined, AppstoreOutlined, AreaChartOutlined, PayCircleOutlined, BarChartOutlined, PoweroffOutlined } from '@ant-design/icons';

import styles from './CSS/MenuList.module.css';
import Model from '../Model/Model.js';

// Using props
const MenuList = ( { darkTheme, onButtonClick } ) => {
    
    // Use useNavigate object to navigate to another screen
    const navigate = useNavigate( );

    // Handle when a button is pressed
    const handleClick = ( buttonId ) => {
        
        onButtonClick( buttonId );
    };

    // Handle the logout button
    const handleLogOut = async ( ) => {

        const status = await Model.logout();

        console.log("Logout status:", status);

        if ( status === "success")
            navigate("/");
    };

    return (

        <Menu 
            theme={darkTheme ? 'dark' : 'light'} 
            mode="inline" 
            className={styles.menu_bar}
        >
            <Menu.Item onClick={ ( ) => handleClick( 'Home' ) } key='home' icon={<HomeOutlined />}>
                Home
            </Menu.Item>
            <Menu.SubMenu key='addProperty' icon={<AreaChartOutlined />}
                title='Add Property'>
                <Menu.Item onClick={ ( ) => handleClick( 'House' ) } key='House'>House</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'Apartment' ) } key='Apartment'>Apartment</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'Parking Lot' ) } key='Lot'>Parking Lot</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'Parking Space' ) } key='ParkingSpace'>Parking Space</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'Office' ) } key='Office'>Office Building</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'OfficeTwo' )} key='OfficeTwo'>Office Space</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item onClick={ ( ) => handleClick( 'Activity' ) } key='activity' icon={<AppstoreOutlined />}>
                Activity
            </Menu.Item>
            <Menu.Item onClick={ ( ) => handleClick( 'PropertyManagement' ) } key='propertyManagement' icon={<BarChartOutlined />}>
                Property Management
            </Menu.Item>
            <Menu.Item onClick={ ( ) => handleClick( 'Payment' ) } key='payment' icon={<PayCircleOutlined />}>
                Payment
            </Menu.Item>
            <Menu.SubMenu key='Settings' icon={<SettingOutlined />}
                title='Settings'>
                <Menu.Item onClick={ ( ) => handleClick( 'ChangeGeneralInformation' ) } key='GeneralInformation'>Modify General Info</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'ChangePhone' ) } key='Phone'>Modify Phone</Menu.Item>
                <Menu.Item onClick={ ( ) => handleClick( 'ChangePassword' ) } key='ChangePassword'>Modify Password</Menu.Item>      
                <Menu.Item onClick={ ( ) => handleClick( 'ChangeEmail' ) } key='ChangeEmail'>Modify Email</Menu.Item> 
                <Menu.Item onClick={ ( ) => handleClick( 'DeleteAccount' ) } key='DeleteAccount'>Delete Account</Menu.Item>     
            </Menu.SubMenu>
            <Menu.Item key='logout' onClick={handleLogOut} icon={<PoweroffOutlined />}>
                Logout
            </Menu.Item>
        </Menu>
    );
}

export default MenuList;