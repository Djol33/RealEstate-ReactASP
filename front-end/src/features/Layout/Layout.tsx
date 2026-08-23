import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '../../shared/components/Header/Header';
import { Footer } from '../../shared/components/Footer/Footer';
import { ChatToast } from '../chat/components/ChatToast/ChatToast';

export interface LayoutProps {
  prop?: string;
}

export function Layout({prop = 'default value'}: LayoutProps) {
  return <>
    <ScrollRestoration />
    <Header></Header>
    <ChatToast />
    <div className="page-content">
      <Outlet/>
    </div>
    <Footer />
  </>
}
