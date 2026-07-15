import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {BasicData} from './BasicData';

const meta: Meta<typeof BasicData> = {
  component: BasicData,
};

export default meta;

type Story = StoryObj<typeof BasicData>;

export const Basic: Story = {args: {}};
