import React, { useRef, useState } from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    useColorModeValue,
    InputGroup,
    InputRightElement,
    Text,
    Heading,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../redux/auth/auth.actions';
import useToastMsg from '../customHooks/useToastMsg';
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
    const dispatch = useDispatch();
    const { loading } = useSelector((store) => store.authManager);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const toastMsg = useToastMsg();

    const navigate = useNavigate();

    const emailRef = useRef();
    const pwdRef = useRef();

    // Валидация полей
    const validateFields = () => {
        const email = emailRef.current.value.trim();
        const password = pwdRef.current.value.trim();
        const newErrors = { email: '', password: '' };

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);

        return !newErrors.email && !newErrors.password;
    };

    const handleLogin = () => {
        if (!validateFields()) return;

        const user = {
            email: emailRef.current.value.trim(),
            password: pwdRef.current.value.trim(),
        };

        dispatch(signin(user, navigate, toastMsg));

        emailRef.current.value = '';
        pwdRef.current.value = '';
    };

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack spacing={8} mx="auto" maxW="lg">
                <Stack align="center">
                    <Heading fontSize="4xl" textAlign="center">
                        Sign-in on Kanban
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                        to maintain your tasks easily ✌️
                    </Text>
                </Stack>
                <Box
                    rounded="lg"
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow="lg"
                    p={8}
                >
                    <Stack spacing={4}>
                        <FormControl id="email" isInvalid={errors.email}>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" ref={emailRef} aria-label="Email address" />
                            {errors.email && (
                                <Text color="red.500" fontSize="sm" mt={2}>
                                    {errors.email}
                                </Text>
                            )}
                        </FormControl>
                        <FormControl id="password" isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    ref={pwdRef}
                                    aria-label="Password"
                                />
                                <InputRightElement h="full">
                                    <Button
                                        variant="ghost"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {errors.password && (
                                <Text color="red.500" fontSize="sm" mt={2}>
                                    {errors.password}
                                </Text>
                            )}
                        </FormControl>
                        <Stack spacing={10}>
                            <Button
                                isLoading={loading}
                                loadingText="Wait"
                                onClick={handleLogin}
                                bg="blue.400"
                                color="white"
                                _hover={{
                                    bg: 'blue.500',
                                }}
                            >
                                Log in
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align="center">
                                New user?{' '}
                                <Link to="/signup" style={{ color: 'blue' }}>
                                    Sign up
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

export default Signin;
