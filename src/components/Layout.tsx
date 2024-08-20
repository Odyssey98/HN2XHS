import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-primary">
            HN2XHS
          </Link>
          <div>
            <Link href="/" className="nav-link mr-4">
              Home
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>
      <footer className="bg-gray-100">
        <div className="container mx-auto px-6 py-3 text-center text-gray-600">
          <p>© 2024 HN to Xiaohongshu</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
