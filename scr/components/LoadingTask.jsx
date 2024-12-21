import React from 'react';
import { Box, Skeleton, Stack } from '@chakra-ui/react';

const LoadingTask = () => {
    return (
        <Stack spacing={4}>
            {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} className="task-loading" p={4} borderRadius="md" boxShadow="sm" bg="white">
                    <Skeleton width="100%" height="15px" />
                    <Skeleton width="100%" height="15px" mt={2} />
                    <Skeleton width="30%" height="5px" mt={4} />
                </Box>
            ))}
        </Stack>
    );
};

export default React.memo(LoadingTask);
