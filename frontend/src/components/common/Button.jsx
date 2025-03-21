import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/components/button.scss';

const Button = ({ 
  children, 
  type = 'button', 
  className = '', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`button ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;