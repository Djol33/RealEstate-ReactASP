import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {PersonalData} from './PersonalData';

const meta: Meta<typeof PersonalData> = {
  component: PersonalData,
};

export default meta;

type Story = StoryObj<typeof PersonalData>;

export const Basic: Story = {args: {}};
