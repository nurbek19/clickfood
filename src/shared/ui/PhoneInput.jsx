import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './PhoneInput.css';

const PhoneInputComponent = ({ 
  value, 
  onChange, 
  label = "Контактный номер телефона",
  placeholder = "+996 555 555 555", 
  disabled = false,
  required = false,
  className = "",
  ...props 
}) => {
  const handleChange = (phone) => {
    let formattedPhone = phone;
    
    // Remove any existing + prefix first
    formattedPhone = formattedPhone.replace(/^\+/, '');
    
    // If it doesn't start with 996, add it
    if (!formattedPhone.startsWith('996')) {
      formattedPhone = '996' + formattedPhone;
    }
    
    // Return with + prefix in format +996555555555
    onChange('+' + formattedPhone);
  };

  return (
    <div className={`field-wrapper ${className}`}>
      <label className="field-label">{label}</label>
      <div className="phone-input-container">
        <PhoneInput
          country={'kg'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          enableSearch={false}
          disableSearchIcon={true}
          disableDropdown={true}
          countryCodeEditable={false}
          preferredCountries={['kg']}
          onlyCountries={['kg']}
        //   disableCountryCode={true}
          {...props}
        />
      </div>
    </div>
  );
};

export default PhoneInputComponent;
