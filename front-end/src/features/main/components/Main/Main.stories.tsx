import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Main} from './Main';

const meta: Meta<typeof Main> = {
  component: Main,
};

export default meta;

type Story = StoryObj<typeof Main>;

export const Basic: Story = {args: {}};
