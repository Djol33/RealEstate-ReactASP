import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Register} from './Register';

const meta: Meta<typeof Register> = {
  component: Register,
};

export default meta;

type Story = StoryObj<typeof Register>;

export const Basic: Story = {args: {}};
