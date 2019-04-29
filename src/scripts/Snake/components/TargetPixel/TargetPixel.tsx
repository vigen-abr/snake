import React from 'react';
import './TargetPixel.scss';

interface props {
    top: number,
    left: number,
    size: number
}

function TargetPixel(props: props) {
  return (
    <div className="game-wrapper__target-pixel" style={{top: `${props.top}px`, left: `${props.left}px`, width: `${props.size}px`, height: `${props.size}px`}}>
    </div>
  );
}

export default TargetPixel;
