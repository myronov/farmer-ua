import React from 'react';

const Loading = () => {
  return (
    <div
      className="position-fixed w-100 h-100 text-center loading"
      style={{
        background: '#0007',
        color: 'white',
        top: 0,
        left: 0,
        zIndex: 99,
      }}
    >
      <svg width="205" height="250" viewBox="0 0 40 50">
        <circle stroke="#fff" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

export default Loading;
