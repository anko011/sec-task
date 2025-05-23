import { Box, Button, DataList, DropdownMenu, Flex, Heading, Inset, ScrollArea, Separator } from '@radix-ui/themes';
import type { ReactNode, Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { useCurrentUser, UserRoleBadge } from '~/entities/users';
import { Can } from '~/features/ability';
import { logout } from '~/features/auth';
import { BackButton } from '~/features/history/back';
import { ChangeThemeButton } from '~/features/themes/change';
import { Link } from '~/shared/ui/link';

export const useContentHeight = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const resizeContent = useCallback(() => {
        if (headerRef.current != null) {
            setContentHeight(window.innerHeight - headerRef.current.clientHeight);
        }
    }, []);

    useEffect(() => {
        resizeContent();
        window.addEventListener('resize', resizeContent);
        return () => {
            window.removeEventListener('resize', resizeContent);
        };
    }, [resizeContent]);

    return { contentHeight, headerRef };
};

const ADMIN_MENU_ITEMS = [
    {
        title: 'Общее',
        items: [{ label: 'Пользователи', to: '/users' }]
    },
    {
        title: 'Организации',
        items: [
            { label: 'Организации', to: '/organizations' },
            { label: 'Типы организаций', to: '/organization-types' }
        ]
    },
    {
        title: 'Задачи',
        items: [
            { label: 'Наименования задач', to: '/task-names' },
            { label: 'Категории задач', to: '/task-categories' }
        ]
    }
];

export function AdminDropdown() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="ghost">Администрирование</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant="soft">
                {ADMIN_MENU_ITEMS.map((section, index) => (
                    <div key={section.title}>
                        {index > 0 && <Separator my="1" size="4" />}
                        <Heading ml="3" size="1">
                            {section.title}
                        </Heading>
                        {section.items.map((item) => (
                            <DropdownMenu.Item asChild key={item.label}>
                                <Link to={item.to} underline="none">
                                    {item.label}
                                </Link>
                            </DropdownMenu.Item>
                        ))}
                    </div>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export function Header({ ref }: { ref?: Ref<HTMLDivElement> }) {
    return (
        <Box asChild p="2" ref={ref} style={{ background: 'var(--color-panel-solid)', boxShadow: 'var(--shadow-3)' }}>
            <Flex align="baseline" asChild justify="between">
                <header>
                    <Flex align="baseline" gap="3" ml="3">
                        <BackButton />
                        <Heading as="h1" size="5">
                            SecTask
                        </Heading>
                    </Flex>
                    <Flex align="baseline" gap="5">
                        <Button asChild variant="ghost">
                            <Link to="/task-packages" underline="none">
                                Пакеты задач
                            </Link>
                        </Button>
                        <Can an="all" I="manage">
                            <AdminDropdown />
                        </Can>
                    </Flex>
                    <Flex align="baseline" gap="2">
                        <UserDropdown />
                        <ChangeThemeButton />
                    </Flex>
                </header>
            </Flex>
        </Box>
    );
}

export function UserDropdown() {
    const { user } = useCurrentUser();
    const navigate = useNavigate();

    if (user == null) return null;

    const handleLogout = () => {
        void (async () => {
            await logout();
            localStorage.removeItem('accessToken');
            await navigate('/sign-in');
        })();
    };

    const fullName = `${user.secondName} ${user.firstName} ${user.patronymic}`;
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button mr="2" variant="ghost">
                    {fullName}
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant="soft">
                <Inset mx="3">
                    <DataList.Root size="2">
                        <DataList.Item align="center">
                            <DataList.Label minWidth="88px">Роль</DataList.Label>
                            <DataList.Value>
                                <UserRoleBadge role={user.role} />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Email</DataList.Label>
                            <DataList.Value>{user.email}</DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Inset>
                <Separator my="2" size="4" />
                <DropdownMenu.Item color="red" onClick={handleLogout}>
                    Выйти
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export function ContentArea({ children, height }: { children?: ReactNode; height: number }) {
    return (
        <ScrollArea asChild style={{ height }}>
            <Box p="4">{children}</Box>
        </ScrollArea>
    );
}

export function MainLayout() {
    const { contentHeight, headerRef } = useContentHeight();

    return (
        <Flex direction="column" position="relative">
            <Header ref={headerRef} />
            <ContentArea height={contentHeight}>
                <Outlet />
            </ContentArea>
        </Flex>
    );
}
