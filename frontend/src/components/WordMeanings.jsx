import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';
const WordMeanings = ({ wordMeanings, displayLanguage }) => {
    if (!wordMeanings || wordMeanings.length === 0) {
      return null;
    }
  
    return (
      <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.offWhite }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: colors.darkRed }}>
          Word Meanings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wordMeanings.map((item, index) => (
            <div 
              key={index} 
              className="p-3 rounded-lg border flex"
              style={{ borderColor: colors.lightBeige }}
            >
              <div className="mr-3 px-2 py-1 rounded self-start" style={{ backgroundColor: colors.lightBeige }}>
                <span className={displayLanguage === 'hindi' ? 'font-hindi' : 'font-sanskrit'} style={{ color: colors.deeperRed }}>
                  {item.word}
                </span>
              </div>
              <div className="flex-1">
                <p className={displayLanguage === 'hindi' ? 'font-hindi' : 'font-serif'} style={{ color: '#634B2A' }}>
                  {displayLanguage === 'hindi' ? item.meaning.hindi : item.meaning.english}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};
  
export default WordMeanings;