import React from 'react';
import { Avatar, Box } from '@chakra-ui/react';

const ProfilePicture = ({ name, size }) => {
    const getInitials = name => {
        // const nameArray = name.split(' ');
        // const initials = nameArray.map(word => word[0].toUpperCase());
        // return initials.join('');
        name[0].toUpperCase();
    };

    return (
        <Box>
            <Avatar name={name} size={size} src="#">
                {getInitials(name)}
            </Avatar>
        </Box>
    );
};

export default ProfilePicture;
