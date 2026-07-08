import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {User} from './User';

const meta: Meta<typeof User> = {
  component: User,
};

export default meta;

type Story = StoryObj<typeof User>;

export const Basic: Story = {args: {}};
