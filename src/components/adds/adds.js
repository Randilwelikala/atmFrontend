import React from 'react';
import './adds.css';

const AdPlayer = () => {
  return (
    <div className="ad-player">
      
      <video autoPlay loop muted className="ad-media">
        <source src="/ads/eadd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AdPlayer;
