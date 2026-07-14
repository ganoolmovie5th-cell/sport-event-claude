'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import SearchModal from './SearchModal';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
