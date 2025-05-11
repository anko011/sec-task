import { Card, Flex } from '@radix-ui/themes';

import { SignInForm } from '~/features/auth';

export function SignInPage() {
    return (
        <Flex align="center" justify="center" minHeight="100vh" minWidth="100vw">
            <Flex asChild minHeight="320px" minWidth="320px">
                <Card size="3">
                    <SignInForm />
                </Card>
            </Flex>
        </Flex>
    );
}
