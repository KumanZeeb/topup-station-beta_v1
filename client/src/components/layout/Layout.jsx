import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import ScrollTop from '../UI/ScrollTop';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <BottomNav />
      <ScrollTop />
    </>
  );
};

export default Layout;
