import {
    BackpackIcon,
    BookmarkIcon,
    ExitIcon,
    LockClosedIcon,
    PersonIcon,
    ReaderIcon,
    TableIcon
} from '@radix-ui/react-icons';
import { Button, Card, DataList, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import type { FC, ReactNode } from 'react';

import { Link } from '~/shared/ui/link';

import sidebarStyles from './sidebar.module.css';

const UserDataList = () => (
    <DataList.Root>
        <DataList.Item>
            <DataList.Label minWidth="88px">ФИО</DataList.Label>
            <DataList.Value>Морозов Владислав Андреевич</DataList.Value>
        </DataList.Item>

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
);

type NavigationItemProps = {
    children?: ReactNode;
    to: string;
};
const NavigationItem: FC<NavigationItemProps> = ({ children, to }) => (
    <Flex align="center" asChild className={sidebarStyles.item} gap="2" p="2">
        <Link highContrast to={to} underline="none">
            {children}
        </Link>
    </Flex>
);

const Navigation = () => (
    <ScrollArea type="hover">
        <Flex direction="column">
            <NavigationItem to="/task-packages">
                <ReaderIcon />
                Задачи
            </NavigationItem>
            <Heading ml="2" my="2" size="1">
                Администрирование
            </Heading>
            <Separator size="4" />
            <NavigationItem to="/organizations">
                <BackpackIcon />
                Организации
            </NavigationItem>
            <NavigationItem to="/organization-types">
                <TableIcon />
                Типы организаций
            </NavigationItem>
            <NavigationItem to="/task-categories">
                <BookmarkIcon />
                Категории задач
            </NavigationItem>
            <NavigationItem to="/staff">
                <PersonIcon />
                Сотрудники
            </NavigationItem>
            <NavigationItem to="/roles">
                <LockClosedIcon />
                Роли и права
            </NavigationItem>
        </Flex>
    </ScrollArea>
);

export function Sidebar() {
    return (
        <Card style={{ height: '100%' }}>
            <Flex align="center" direction="column" gap="4" py="2" style={{ height: '100%' }}>
                <UserDataList />
                <Separator my="2" size="4" />
                <Navigation />
                <Button asChild variant="ghost">
                    <Link color="crimson" to="/logout" underline="none">
                        <ExitIcon />
                        Выйти
                    </Link>
                </Button>
            </Flex>
        </Card>
    );
}
