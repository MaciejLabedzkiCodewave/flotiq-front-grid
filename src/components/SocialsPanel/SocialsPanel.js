import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '../Panel/Panel';

// :: Images
import githubIcon from '../../images/social-icons/github.svg';
import twitterIcon from '../../images/social-icons/twitter.svg';
import redditIcon from '../../images/social-icons/reddit.svg';
import linkedinIcon from '../../images/social-icons/linkedin.svg';
import youtubeIcon from '../../images/social-icons/youtube.svg';
import facebookIcon from '../../images/social-icons/facebook.svg';
import discordIcon from '../../images/social-icons/discord.svg';

const defaultSocials = [
    {
        name: 'Github',
        icon: githubIcon,
        link: 'https://github.com/flotiq',
    },
    {
        name: 'Twitter',
        icon: twitterIcon,
        link: 'https://twitter.com/flotiq',
    },
    {
        name: 'Reddit',
        icon: redditIcon,
        link: 'https://www.reddit.com/r/flotiq/',
    },
    {
        name: 'LinkedIn',
        icon: linkedinIcon,
        link: 'https://www.linkedin.com/company/flotiq',
    },
    {
        name: 'YouTube',
        icon: youtubeIcon,
        link: 'https://www.youtube.com/channel/UC4wpV-D9mIt1JjN_g_iyXXw',
    },
    {
        name: 'Facebook',
        icon: facebookIcon,
        link: 'https://www.facebook.com/flotiq',
    },
    {
        name: 'Discord',
        icon: discordIcon,
        link: 'https://discord.com/invite/FwXcHnX',
    },
];

export const SocialButton = ({ name, icon, link }) => (
    <a href={link} className={'flex items-center'}>
        <img src={icon} alt={name} />
        <div className={'grow pl-2 font-header'}>{name}</div>
    </a>
);

export const SocialsPanel = ({
    title,
    items = defaultSocials,
    spaceless = false,
}) => (
    <Panel title={title} spaceless={spaceless}>
        <ul className={'grid grid-cols-2 gap-4 max-w-[80%]'}>
            {items?.map((social) => (
                <li key={`social-${social.name}`}>
                    <SocialButton
                        name={social.name}
                        icon={social.icon}
                        link={social.link}
                    />
                </li>
            ))}
        </ul>
    </Panel>
);

SocialsPanel.propTypes = {
    title: PropTypes.any,
    items: PropTypes.any,
    spaceless: PropTypes.any,
};

SocialButton.propTypes = {
    name: PropTypes.any,
    icon: PropTypes.any,
    link: PropTypes.any,
};
