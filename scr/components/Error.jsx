import React from 'react';
import { Heading, VStack } from '@chakra-ui/react';

function Error({ children, className = "" }) {
    return (
        <VStack className={className}>
            <Heading size="sm" color="red.400" textAlign="center">
                ⚠ Error
            </Heading>
            {children}
        </VStack>
    );
}

export default React.memo(Error);