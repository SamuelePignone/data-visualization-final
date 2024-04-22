import React from 'react';

const Chapter = ({ text, id='' }) => {
  return (
    <h1 className="text-6xl font-bold text-center text-white mt-16 mb-20" id={id}>
      {text}
    </h1>
  );
};

export default Chapter;
