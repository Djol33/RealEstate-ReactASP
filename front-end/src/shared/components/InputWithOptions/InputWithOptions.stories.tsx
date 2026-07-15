import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {InputWithOptions} from './InputWithOptions';

const meta: Meta<typeof InputWithOptions> = {
  component: InputWithOptions,
};

export default meta;

type Story = StoryObj<typeof InputWithOptions>;

export const Basic: Story = {args: {}};
