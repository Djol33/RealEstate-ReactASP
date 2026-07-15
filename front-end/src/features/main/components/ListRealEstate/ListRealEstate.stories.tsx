import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {ListRealEstate} from './ListRealEstate';

const meta: Meta<typeof ListRealEstate> = {
  component: ListRealEstate,
};

export default meta;

type Story = StoryObj<typeof ListRealEstate>;

export const Basic: Story = {args: {}};
