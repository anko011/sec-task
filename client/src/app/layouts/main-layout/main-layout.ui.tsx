import {
    Box,
    Button,
    DataList,
    DropdownMenu,
    Flex,
    Heading,
    Inset,
    ScrollArea,
    Separator,
    Text
} from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';

import { BackButton } from '~/features/history/back';
import { ChangeThemeButton } from '~/features/themes/change';
import { Link } from '~/shared/ui/link';

export function MainLayout() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const resizeContent = () => {
        setContentHeight(window.innerHeight - (headerRef.current?.clientHeight ?? 0));
    };

    useEffect(() => {
        resizeContent();

        window.addEventListener('resize', resizeContent);
        return () => {
            window.removeEventListener('resize', resizeContent);
        };
    }, []);

    return (
        <Flex direction="column" position="relative">
            <Box
                asChild
                p="2"
                ref={headerRef}
                style={{ background: 'var(--color-panel-solid)', boxShadow: 'var(--shadow-3)' }}
            >
                <Flex align="baseline" asChild justify="between">
                    <header>
                        <Flex align="baseline" gap="3" ml="3">
                            <BackButton />
                            <Heading>SecTask</Heading>
                        </Flex>
                        <Box>
                            <Button asChild mr="4" variant="ghost">
                                <Link to="/task-packages" underline="none">
                                    Пакеты задач
                                </Link>
                            </Button>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button variant="ghost">Администрирование</Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content variant="soft">
                                    <Heading ml="3" size="1">
                                        Общее
                                    </Heading>
                                    <DropdownMenu.Item asChild>
                                        <Link to="/staff" underline="none">
                                            Пользователи
                                        </Link>
                                    </DropdownMenu.Item>
                                    <Heading ml="3" mt="1" size="1">
                                        Организации
                                    </Heading>
                                    <Separator my="1" size="4" />
                                    <DropdownMenu.Item asChild>
                                        <Link to="/organizations" underline="none">
                                            Организации
                                        </Link>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item asChild>
                                        <Link to="/organization-types" underline="none">
                                            Типы организаций
                                        </Link>
                                    </DropdownMenu.Item>
                                    <Heading ml="3" mt="1" size="1">
                                        Задачи
                                    </Heading>
                                    <Separator my="1" size="4" />
                                    <DropdownMenu.Item>Наименования задач</DropdownMenu.Item>
                                    <DropdownMenu.Item asChild>
                                        <Link to="/task-categories" underline="none">
                                            Категории задач
                                        </Link>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Box>
                        <Flex align="baseline" gap="2">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button mr="2" variant="ghost">
                                        Морозов Владислав Андреевич
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content variant="soft">
                                    <Inset mx="3">
                                        <DataList.Root size="2">
                                            <DataList.Item align="center">
                                                <DataList.Label minWidth="88px">Роль</DataList.Label>
                                                <DataList.Value>
                                                    <Text color="jade">Администратор</Text>
                                                </DataList.Value>
                                            </DataList.Item>

                                            <DataList.Item>
                                                <DataList.Label minWidth="88px">Email</DataList.Label>
                                                <DataList.Value>
                                                    <Link to="mailto:vlad@workos.com">vlad@workos.com</Link>
                                                </DataList.Value>
                                            </DataList.Item>

                                            <DataList.Item>
                                                <DataList.Label minWidth="88px">Компания</DataList.Label>
                                                <DataList.Value>
                                                    <Link to="/">THolder</Link>
                                                </DataList.Value>
                                            </DataList.Item>
                                        </DataList.Root>
                                    </Inset>
                                    <Separator my="3" size="4" />
                                    <DropdownMenu.Item color="red">Выйти</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                            <ChangeThemeButton />
                        </Flex>
                    </header>
                </Flex>
            </Box>
            <ScrollArea asChild style={{ height: contentHeight }}>
                <Box p="2">
                    <Outlet />
                </Box>
            </ScrollArea>
        </Flex>
    );
}
