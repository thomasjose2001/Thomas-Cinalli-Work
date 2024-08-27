// Component that modifies properties

import React, { useState } from 'react';
import { Input, Form } from 'antd';
import { Button } from 'antd/es/radio';

import styles from './ModifyProperty.module.css'; 

// Using props
const ModifyProperty = ( { handleCancel } ) => {

    const [ location, setLocation ] = useState( '' );
    const [ district, setDistrict ] = useState( '' );
    const [ address, setAddress ] = useState( '' );
    const [ bathrooms, setBathrooms ] = useState( '' );
    const [ bedrooms, setBedrooms ] = useState( '' );
    const [ dateBuilt, setDateBuilt ] = useState( '' );

    // Handles the submit button
    const handleSubmit = ( ) => {

        handleCancel( );
    }

    return (
        
        <div className={styles.wrapper}>
            <p className={styles.modifyPropertyTitle}><strong>Modify Property</strong></p>
            <Form.Item label='Location'>
                <Input onChange={(e) => setLocation(e.target.value)} />
            </Form.Item>
            <Form.Item label='District'>
                <Input onChange={(e) => setDistrict(e.target.value)} />
            </Form.Item>
            <Form.Item label='Address'>
                <Input onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>
            <Form.Item label='Bathrooms'>
                <Input onChange={(e) => setBathrooms(e.target.value)} />
            </Form.Item>
            <Form.Item label='Bedrooms'>
                <Input onChange={(e) => setBedrooms(e.target.value)} />
            </Form.Item>
            <Form.Item label='Date Built'>
                <Input onChange={(e) => setDateBuilt(e.target.value)} />
            </Form.Item>
            
            <Button className={styles.submitButton} onClick={handleSubmit}>Submit Changes</Button>
        </div>
    );
}

export default ModifyProperty;