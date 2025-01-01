import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Text,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { CiEdit } from 'react-icons/ci';
import { AiOutlinePlus } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import { BsCheckLg, BsGrid1X2 } from 'react-icons/bs';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard, deleteBoard, editBoard, getBoards } from '../redux/board/board.actions';
import { getTasks } from '../redux/tasks/tasks.actions';
import Error from './Error';

const Sidebar = () => {
    const navigate = useNavigate();
    const newBoardNameRef = useRef();
    const editBoardNameRef = useRef();
    const deleteBoardRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [activeBoard, setActiveBoard] = useState(null);
    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    const [editingBoardId, setEditingBoardId] = useState(null);

    const dispatch = useDispatch();
    const { loading, error, data: boards = [] } = useSelector((store) => store.boardManager);

    useEffect(() => {
        dispatch(getBoards(navigate));
    }, [dispatch, navigate]);

    useEffect(() => {
        if (boards.length && activeBoard !== null) {
            const boardId = boards[activeBoard]._id;
            dispatch(getTasks(boardId, navigate));
        }
    }, [activeBoard, boards, dispatch, navigate]);

    const handleCreateBoard = () => {
        const boardName = newBoardNameRef.current.value.trim();
        if (boardName) {
            dispatch(createBoard(boardName));
            setIsCreatingBoard(false);
        }
    };

    const handleEditBoard = () => {
        const newName = editBoardNameRef.current.value.trim();
        const board = boards.find((b) => b._id === editingBoardId);
        if (board && newName && newName !== board.name) {
            dispatch(editBoard(editingBoardId, newName));
            setEditingBoardId(null);
        }
    };

    const handleDeleteBoard = () => {
        dispatch(deleteBoard(deleteBoardRef.current));
        setActiveBoard(null);
        onClose();
    };

    const renderLoadingSkeleton = () => (
        [1, 2, 3].map((e) => (
            <HStack className="skeleton-board-option" key={e}>
                <Skeleton height="28px" width="28px" />
                <Skeleton height="28px" width="9rem" />
            </HStack>
        ))
    );

    const renderBoards = () => (
        boards.map((board, index) => (
            <Button
                key={board._id}
                className={`board-option ${activeBoard === index ? 'active-board' : 'non-active-board'}`}
                onClick={() => setActiveBoard(index)}
            >
                <HStack justify="space-between" width="full">
                    {editingBoardId === board._id ? (
                        <HStack className="edit-board-input">
                            <BsGrid1X2 />
                            <Input autoFocus defaultValue={board.name} ref={editBoardNameRef} />
                            <HStack>
                                <BsCheckLg onClick={handleEditBoard} />
                                <RxCross2 onClick={() => setEditingBoardId(null)} />
                            </HStack>
                        </HStack>
                    ) : (
                        <HStack>
                            <BsGrid1X2 />
                            <Text>{board.name}</Text>
                        </HStack>
                    )}
                    {!editingBoardId && (
                        <HStack className="board-controller">
                            <CiEdit
                                onClick={() => setEditingBoardId(board._id)}
                                style={{ color: 'white' }}
                            />
                            <MdOutlineDeleteForever onClick={() => {
                                deleteBoardRef.current = board._id;
                                onOpen();
                            }} />
                        </HStack>
                    )}
                </HStack>
            </Button>
        ))
    );

    return (
        <>
            <VStack align="flex-start" spacing={4}>
                <Text className="subHeading-text">ALL BOARDS ({boards.length})</Text>

                {loading && renderLoadingSkeleton()}
                {error?.status ? (
                    <Error className="error-board-option">
                        <Text>{error.message}</Text>
                    </Error>
                ) : (
                    renderBoards()
                )}

                {isCreatingBoard && (
                    <HStack className="new-board-input">
                        <Input defaultValue={`Board ${boards.length + 1}`} ref={newBoardNameRef} />
                        <HStack>
                            <BsCheckLg onClick={handleCreateBoard} />
                            <RxCross2 onClick={() => setIsCreatingBoard(false)} />
                        </HStack>
                    </HStack>
                )}

                <Button className="new-board-btn"
                onClick={() => {
                    setIsCreatingBoard(true);
                    handleCreateBoard();
                }}
                >
                    <HStack>
                        {isCreatingBoard ? <RxCross2 /> : <AiOutlinePlus />}
                        <Text>{isCreatingBoard ? 'Add new board' : 'Create New Board'}</Text>
                    </HStack>
                </Button>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalBody>
                        <Text>Deleting this board cannot be undone. Are you sure?</Text>
                        <Text color="var(--primary-delete-color)" mt={4}>🗑 Delete the Board</Text>
                    </ModalBody>
                    <ModalFooter>
                        <div class="gap-10px">
                        <Button colorScheme="blue" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={handleDeleteBoard}>
                            <HStack>
                                <RiDeleteBin6Line />
                                <Text>Delete</Text>
                            </HStack>
                        </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default React.memo(Sidebar);
