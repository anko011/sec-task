import { Flex, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

type FormFieldProps = { children?: ReactNode; direction?: 'column' | 'row'; error?: string; label?: string };

export function FormField({ children, direction = 'column', error, label }: FormFieldProps) {
    if (!label)
        return (
            <Flex direction="column" width="100%" gap="1">
                {children}
                {error ? (
                    <Text color="red" size="1">
                        {error}
                    </Text>
                ) : null}
            </Flex>
        );

    return (
        <Flex asChild direction={direction} gap="2">
            <label style={{ width: '100%' }}>
                <Text as="div" mb="-1" size="2" weight="bold">
                    {label}
                </Text>
                {children}
                {error != null && (
                    <Text as="div" color="red" mt={direction === 'row' ? '0' : '-2'} size="1">
                        {error}
                    </Text>
                )}
            </label>
        </Flex>
    );
}
