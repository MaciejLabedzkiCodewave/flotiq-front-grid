import React from 'react';

import { SocialsPanel } from '../components/SocialsPanel/SocialsPanel';

export default {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'Components/Socials Panel',
    component: SocialsPanel,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <SocialsPanel {...args} />;

export const Default = Template.bind({});

Default.args = {
    title: 'If you enjoy working with Flotiq, please spread the word about it:',
};

export const Spaceless = Template.bind({});

Spaceless.args = {
    title: 'If you enjoy working with Flotiq, please spread the word about it:',
    spaceless: true,
};
