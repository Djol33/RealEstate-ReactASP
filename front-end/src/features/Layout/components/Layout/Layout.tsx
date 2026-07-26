import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../../shared/components/Header/Header';
import { ChatToast } from '../../../chat/components/ChatToast/ChatToast';

export interface LayoutProps {
  prop?: string;
}

export function Layout({prop = 'default value'}: LayoutProps) {
  return <>
    <Header></Header>
    <ChatToast />
    <Outlet/>
  </>
}
