import React from 'react';

const Logo = ({ className }) => {
  return (
    <div className={className}>
      <img src="/trlogos.png" alt="Tivora Motors Logo" className="w-full h-full object-contain" />
    </div>
  );
};

export default Logo;
