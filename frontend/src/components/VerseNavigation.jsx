import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';

const VerseNavigation = ({ totalVerses, currentVerse, chapterNumber, onNavigate }) => {
  const handlePrev = () => {
    if (currentVerse > 1) {
      onNavigate(chapterNumber, currentVerse - 1);
    } else if (chapterNumber > 1) {
      // Navigate to the previous chapter
      // In a real app, you'd need to know the total verses of the previous chapter
      onNavigate(chapterNumber - 1, 1); // Just going to first verse as an example
    }
  };

  const handleNext = () => {
    if (currentVerse < totalVerses) {
      onNavigate(chapterNumber, currentVerse + 1);
    } else if (chapterNumber < 18) {
      // Navigate to the next chapter
      onNavigate(chapterNumber + 1, 1);
    }
  };

  // Generate verse buttons
  const generateVerseButtons = () => {
    const buttons = [];
    let start = Math.max(1, currentVerse - 3);
    let end = Math.min(totalVerses, start + 6);
    
    // Adjust start if end is at max
    if (end === totalVerses) {
      start = Math.max(1, end - 6);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onNavigate(chapterNumber, i)}
          className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-colors text-xs md:text-sm"
          style={{
            backgroundColor: i === currentVerse ? colors.primaryRed : colors.lightBeige,
            color: i === currentVerse ? 'white' : colors.deeperRed,
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex items-center justify-between border p-2 sm:p-3 md:p-4 rounded-none shadow-md" style={{ backgroundColor: colors.offWhite }}>
      <button
        onClick={handlePrev}
        disabled={currentVerse === 1 && chapterNumber === 1}
        className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg transition-colors flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap"
        style={{
          backgroundColor: colors.lightBeige,
          color: colors.deeperRed,
          opacity: (currentVerse === 1 && chapterNumber === 1) ? 0.5 : 1,
          width: '80px', // Fixed width for small screens
          justifyContent: 'center'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden xs:inline">Prev</span>
      </button>

      <div className="hidden sm:flex space-x-1 md:space-x-2 overflow-hidden">
        {generateVerseButtons()}
      </div>

      <div className="sm:hidden flex items-center justify-center text-xs whitespace-nowrap">
        <span style={{ color: '#634B2A' }}>
          Verse {currentVerse}/{totalVerses}
        </span>
      </div>

      <button
        onClick={handleNext}
        disabled={currentVerse === totalVerses && chapterNumber === 18}
        className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg transition-colors flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap"
        style={{
          backgroundColor: colors.lightBeige,
          color: colors.deeperRed,
          opacity: (currentVerse === totalVerses && chapterNumber === 18) ? 0.5 : 1,
          width: '80px', // Fixed width for small screens
          justifyContent: 'center'
        }}
      >
        <span className="hidden xs:inline">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default VerseNavigation;