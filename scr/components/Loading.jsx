import React from 'react';
import { Center, Heading, Spinner, VStack } from '@chakra-ui/react';

function Loading() {
    return (
        <Center minH="100vh">
            <VStack spacing={5}>
                <Spinner color="var(--primary-color)" thickness="4px" size="xl" />
                <Heading size="md">Please wait...</Heading>
            </VStack>
        </Center>
    );
}

export default React.memo(Loading);
