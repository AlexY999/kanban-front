import React, { lazy } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {Box, Center, Flex, Heading, Text, VStack} from '@chakra-ui/react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LazyLoadHandler from '../components/LazyLoadHandler';
import LoadingTask from '../components/LoadingTask';
import useToastMsg from '../customHooks/useToastMsg';
import { updateTask } from '../redux/tasks/tasks.actions';

const Error = lazy(() => import('../components/Error'));
const TaskSection = lazy(() => import('../components/TaskSection'));

function Board() {
    const { loading, error, data: board } = useSelector((store) => store.tasksManager);
    const dispatch = useDispatch();
    const toastMsg = useToastMsg();

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || source.droppableId === destination.droppableId) return;

        const newStatus = destination.droppableId.split('_')[0];
        dispatch(updateTask(draggableId, board._id, { status: newStatus }, toastMsg));
    };

    const renderTaskSections = () => {
        if (error?.status) {
            return (
                <LazyLoadHandler>
                    <Center>
                        <Error>
                            <Heading size="md">{error.message}</Heading>
                        </Error>
                    </Center>
                </LazyLoadHandler>
            );
        }

        if (!board.tasks) {
            return (
                <Box className="text-wrapper">
                    <VStack>
                        <Heading color="var(--primary-color)" textAlign="center">
                            SELECT A BOARD TO SEE THE DATA
                        </Heading>
                    </VStack>
                </Box>
            );
        }

        return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box className="tasks">
                    {loading && <div className="loading-overlay"></div>}
                    {['Todo', 'Doing', 'Done'].map((status, index) => (
                        <LazyLoadHandler key={status} suspenceFallback={<LoadingTask />}>
                            <TaskSection title={status} />
                        </LazyLoadHandler>
                    ))}
                </Box>
            </DragDropContext>
        );
    };

    return (
        <>
            <Navbar />
            <Flex className="container">
                <Box className="sidebar">
                    <Sidebar />
                </Box>
                {renderTaskSections()}
            </Flex>
            <Text align="center" position="fixed" bottom="0" width="100%">
                Copyright © 2024-2025
            </Text>

        </>
    );
}

export default React.memo(Board);