import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {CompanyInfo} from './CompanyInfo';

const meta: Meta<typeof CompanyInfo> = {
  component: CompanyInfo,
};

export default meta;

type Story = StoryObj<typeof CompanyInfo>;

export const Basic: Story = {args: {}};
