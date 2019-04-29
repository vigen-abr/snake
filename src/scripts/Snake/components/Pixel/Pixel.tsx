import React from 'react';
import './Pixel.scss';

interface props {
    top: number,
    left: number,
    size: number
}

function Pixel(props: props) {
  return (
    <div className="game-wrapper__pixel" style={{top: `${props.top}px`, left: `${props.left}px`, width: `${props.size}px`, height: `${props.size}px`}}>
    </div>
  );
}

export default Pixel;
