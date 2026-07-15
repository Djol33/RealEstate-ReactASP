import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {RegisterCompany} from './RegisterCompany';

const meta: Meta<typeof RegisterCompany> = {
  component: RegisterCompany,
};

export default meta;

type Story = StoryObj<typeof RegisterCompany>;

export const Basic: Story = {args: {}};
