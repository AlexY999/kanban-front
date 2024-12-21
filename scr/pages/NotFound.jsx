import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, teal.400, teal.600)"
                backgroundClip="text"
                fontWeight="extrabold"
            >
                404
            </Heading>

            <Text fontSize="lg" mt={4} mb={2} fontWeight="semibold">
                Page Not Found
            </Text>

            <Text color="gray.500" mb={6}>
                The page you're looking for does not seem to exist.
            </Text>

            <NavLink to="/">
                <Button
                    colorScheme="teal"
                    size="lg"
                    px={6}
                    _hover={{
                        bg: 'teal.500',
                        transform: 'scale(1.05)',
                    }}
                    transition="all 0.2s"
                >
                    Go to Home
                </Button>
            </NavLink>
        </Box>
    );
}
