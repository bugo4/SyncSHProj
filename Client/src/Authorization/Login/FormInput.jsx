import React from 'react'
import { useState } from 'react';

export default function FormInput( {placeholder, fieldName, setLoginField, fieldValue, inputType} ) {
    const [newFieldValue, setNewFieldvalue] = useState(fieldValue)
    function handleFormInputChange(event) {
        const newValue = event.target.value;
        setNewFieldvalue(newValue)
        console.log(newValue)
        setLoginField(fieldName, newValue)
    }
    return (
            <input type={inputType} placeholder={placeholder} onChange={handleFormInputChange} value={newFieldValue}/>
    )
}
