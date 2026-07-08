import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Placeholder} from './Placeholder';

const meta: Meta<typeof Placeholder> = {
  component: Placeholder,
};

export default meta;

type Story = StoryObj<typeof Placeholder>;

export const Basic: Story = {args: {}};
