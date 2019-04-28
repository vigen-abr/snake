import React from 'react';
import './TargetPixel.scss';

function TargetPixel(props) {
  return (
    <div className="game-wrapper__target-pixel" style={{top: `${props.top}px`, left: `${props.left}px`, width: `${props.size}px`, height: `${props.size}px`}}>
    </div>
  );
}

export default TargetPixel;
