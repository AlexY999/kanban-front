import React, { useMemo, useRef, useState } from 'react';
import {
    Box,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Heading,
    Select,
    HStack,
    Input,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { TbEdit } from 'react-icons/tb';
import { RxCross2 } from 'react-icons/rx';
import { MdDelete } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import useToastMsg from '../customHooks/useToastMsg';
import { deleteSubTask, deleteTask, updateSubTask, updateTask } from '../redux/tasks/tasks.actions';

// Utility: Format date and time
const formatDateTime = (createdAt) => {
    const dateObj = new Date(createdAt);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };
    const [date, time] = dateObj.toLocaleString('en-US', options).split(', ');
    return { date, time };
};

function Task({ t, index }) {
    const { _id: taskId, title, description, status, subtask, createdAt } = t;
    const { date, time } = useMemo(() => formatDateTime(createdAt), [createdAt]);

    const dispatch = useDispatch();
    const { data: { _id: boardId } } = useSelector((store) => store.tasksManager);
    const { onOpen, onClose, isOpen } = useDisclosure();
    const toastMsg = useToastMsg();

    const editNameRef = useRef();
    const editDescRef = useRef();
    const editSubtaskRef = useRef();

    const [editName, setEditName] = useState(false);
    const [editDesc, setEditDesc] = useState(false);
    const [editSubtask, setEditSubtask] = useState(null);

    // Handlers
    const handleUpdate = (type, ref, id, data) => {
        const newValue = ref.current.value.trim();
        if (newValue && newValue !== data) {
            const action = type === 'task' ? updateTask : updateSubTask;
            dispatch(action(id, boardId, { title: newValue }, toastMsg));
        }
    };

    const handleTaskDelete = () => {
        dispatch(deleteTask(taskId, boardId, toastMsg));
        onClose();
    };

    const handleSubtaskDelete = (subtaskId) => {
        dispatch(deleteSubTask(subtaskId, taskId, boardId, toastMsg));
    };

    const handleStatusChange = (type, id, value) => {
        const action = type === 'task' ? updateTask : updateSubTask;
        dispatch(action(id, boardId, value, toastMsg));
    };

    // Render subtasks
    const renderSubtasks = () =>
        subtask.map((st) => (
            <HStack key={st._id} className="subtask" justifyContent="space-between">
                {editSubtask === st._id ? (
                    <HStack>
                        <Input autoFocus defaultValue={st.title} ref={editSubtaskRef} />
                        <HStack>
                            <BsCheckLg onClick={() => handleUpdate('subtask', editSubtaskRef, st._id, st.title)} />
                            <RxCross2 onClick={() => setEditSubtask(null)} />
                        </HStack>
                    </HStack>
                ) : (
                    <>
                        <HStack>
                            <input
                                type="checkbox"
                                defaultChecked={st.isCompleted}
                                onChange={(e) =>
                                    handleStatusChange('subtask', st._id, { isCompleted: e.target.checked })
                                }
                            />
                            <Text as={st.isCompleted ? 's' : 'p'}>{st.title}</Text>
                        </HStack>
                        <HStack>
                            <TbEdit onClick={() => setEditSubtask(st._id)} />
                            <MdDelete onClick={() => handleSubtaskDelete(st._id)} />
                        </HStack>
                    </>
                )}
            </HStack>
        ));

    return (
        <>
            <Draggable draggableId={taskId} index={index}>
                {(provided, snapshot) => (
                    <Box
                        className={`task ${snapshot.isDragging ? 'dragging-task' : ''}`}
                        onClick={onOpen}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Text className="task-heading" noOfLines={2} cursor="pointer">
                            {description}
                        </Text>
                        <Text className="subtask-info">
                            {subtask.filter((st) => st.isCompleted).length} of {subtask.length} subtasks
                        </Text>
                    </Box>
                )}
            </Draggable>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {editName ? (
                            <HStack>
                                <Input autoFocus defaultValue={title} ref={editNameRef} />
                                <HStack>
                                    <BsCheckLg onClick={() => handleUpdate('task', editNameRef, taskId, title)} />
                                    <RxCross2 onClick={() => setEditName(false)} />
                                </HStack>
                            </HStack>
                        ) : (
                            <Heading onDoubleClick={() => setEditName(true)}>Task: {title}</Heading>
                        )}
                        <HStack>
                            <TbEdit onClick={() => setEditName(true)} />
                            <RiDeleteBin6Line onClick={handleTaskDelete} />
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        {editDesc ? (
                            <HStack>
                                <Input autoFocus defaultValue={description} ref={editDescRef} />
                                <HStack>
                                    <BsCheckLg onClick={() => handleUpdate('task', editDescRef, taskId, description)} />
                                    <RxCross2 onClick={() => setEditDesc(false)} />
                                </HStack>
                            </HStack>
                        ) : (
                            <HStack justifyContent="space-between">
                                <Text onDoubleClick={() => setEditDesc(true)}>{description}</Text>
                                <TbEdit onClick={() => setEditDesc(true)} />
                            </HStack>
                        )}

                        <VStack align="flex-start" spacing={4}>
                            <Text>Subtasks ({subtask.filter((st) => st.isCompleted).length} of {subtask.length})</Text>
                            {renderSubtasks()}
                            <Text>Current Status</Text>
                            <Select onChange={(e) => handleStatusChange('task', taskId, { status: e.target.value })} defaultValue={status}>
                                <option value="Todo">➕ Todo</option>
                                <option value="Doing">⏳ Doing</option>
                                <option value="Done">✔ Done</option>
                            </Select>
                            <HStack color="gray.600" fontSize="12px">
                                <bdi>Created at:</bdi>
                                <Text>{date} | 🕖 {time}</Text>
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default React.memo(Task);
