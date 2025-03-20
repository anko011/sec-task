import { Box, Flex, Grid, Heading } from '@radix-ui/themes';
import { Outlet } from 'react-router';

import { Sidebar } from './sidebar.ui';

export function MainLayout() {
    return (
        <Grid areas='"n h" "n c"' columns="250px 1fr" gap="4" height="100vh" p="4" rows="32px 1fr" width="auto">
            <Flex align="center" gridArea="h">
                <Heading>Главная</Heading>
            </Flex>
            <Box gridArea="n">
                <Sidebar />
            </Box>
            <Box gridArea="c">
                <Outlet />
            </Box>
        </Grid>
    );
}
