import React, { useState } from 'react';
import Draggable from 'react-draggable';
export default function TextDrag() {
  const [activeDrags, setActiveDrags] = useState(0);

  const onStart = () => {
    setActiveDrags(activeDrags + 1);
  };

  const onStop = () => {
    setActiveDrags(activeDrags + 1);
  };
  const dragHandlers = { onStart: onStart, onStop: onStop };
  return (
    <Draggable
      //   axis='y'
      setCursor={true}
      defaultPosition={{ x: 0, y: 4 }}
      position={null}
      //   grid={[2, 25]}
      scale={1}
      bounds='parent'
      // onStart={handleStart}
      // onDrag={handleDrag}
      // onStop={handleStop}
      {...dragHandlers}
    >
      <div
        className='header_pdf'
        // style={styles.font(
        //   props.fontSize,
        //   props.fontFamily,
        //   props.background
        // )}
      >
        {' '}
        +93 799773529
      </div>
    </Draggable>
  );
}
