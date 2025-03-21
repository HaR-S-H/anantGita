import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/components/input.scss';

const InputField = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="input-container">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'has-error' : ''}`}
        {...props}
      />
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

InputField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
  };
  
  export default InputField;
  