import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {addRealEstate} from './addRealEstate';

const meta: Meta<typeof addRealEstate> = {
  component: addRealEstate,
};

export default meta;

type Story = StoryObj<typeof addRealEstate>;

export const Basic: Story = {args: {}};
