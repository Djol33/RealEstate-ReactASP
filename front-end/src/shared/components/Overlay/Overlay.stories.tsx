import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Overlay} from './Overlay';

const meta: Meta<typeof Overlay> = {
  component: Overlay,
};

export default meta;

type Story = StoryObj<typeof Overlay>;

export const Basic: Story = {args: {}};
