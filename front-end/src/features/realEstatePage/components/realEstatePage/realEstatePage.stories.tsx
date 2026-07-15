import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {realEstatePage} from './realEstatePage';

const meta: Meta<typeof realEstatePage> = {
  component: realEstatePage,
};

export default meta;

type Story = StoryObj<typeof realEstatePage>;

export const Basic: Story = {args: {}};
