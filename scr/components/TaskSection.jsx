import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Text, Box } from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';

import Task from './Task';

function TaskSection({ title }) {
    const { data: board } = useSelector((store) => store.tasksManager);

    const filteredTasks = useMemo(
        () => board.tasks.filter((task) => task.status === title),
        [board.tasks, title]
    );

    return (
        <Droppable droppableId={`${title}_section`}>
            {(provided, snapshot) => (
                <Box
                    className={`task-section ${snapshot.isDraggingOver ? 'task-dragging-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <Text className="subHeading-text" data-title={title}>
                        {title} ({filteredTasks.length})
                    </Text>

                    {filteredTasks.map((task, index) => (
                        <Task key={task._id} t={task} index={index} />
                    ))}

                    {provided.placeholder}
                </Box>
            )}
        </Droppable>
    );
}

export default React.memo(TaskSection);
