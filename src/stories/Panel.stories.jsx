import React from 'react';

import { Panel } from '../components/Panel/Panel';

export default {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'Components/Panel',
    component: Panel,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => (
    <Panel {...args}>
        <p>Panel demo content</p>
    </Panel>
);

export const Default = Template.bind({});

Default.args = {
    title: 'Hello world panel',
};
