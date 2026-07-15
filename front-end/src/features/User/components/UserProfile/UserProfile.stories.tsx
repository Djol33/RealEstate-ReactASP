import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {UserProfile} from './UserProfile';

const meta: Meta<typeof UserProfile> = {
  component: UserProfile,
};

export default meta;

type Story = StoryObj<typeof UserProfile>;

export const Basic: Story = {args: {}};
