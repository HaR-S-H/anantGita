import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';
const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.paleBeige }}>
      <div className="p-6 rounded-lg shadow-lg max-w-md text-center" style={{ backgroundColor: colors.offWhite }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.deeperRed }}>{message}</h2>
        <button 
          onClick={onRetry}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: colors.primaryRed, color: 'white' }}
        >
          Try Again
        </button>
      </div>
    </div>
);
  
export default ErrorDisplay;