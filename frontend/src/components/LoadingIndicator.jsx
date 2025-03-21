import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';
const LoadingIndicator = () => (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.paleBeige }}>
      <div className="animate-spin w-12 h-12 rounded-full border-4 border-t-transparent" style={{ borderColor: `${colors.primaryRed} transparent ${colors.primaryRed} ${colors.primaryRed}` }}></div>
    </div>
  );
  
export default LoadingIndicator;