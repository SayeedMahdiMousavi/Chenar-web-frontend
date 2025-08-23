import React, { ReactNode } from 'react';

export function FormItemRequiredLabel({ label }: { label: ReactNode }) {
  return (
    <span>
      {label}
      <span className='star'>*</span>
    </span>
  );
}
