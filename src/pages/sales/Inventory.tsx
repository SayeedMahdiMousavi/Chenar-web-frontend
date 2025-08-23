import React, { ReactNode, Suspense } from 'react';
import InventoryNavbar from './Navbar';

export default function Inventory(props: { children: ReactNode }) {
  return (
    <>
      <InventoryNavbar />
      <Suspense fallback={'loading...'}>{props.children}</Suspense>
    </>
  );
}
