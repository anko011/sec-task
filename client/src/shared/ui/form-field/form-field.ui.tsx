import { Flex, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

type FormFieldProps = { children?: ReactNode; direction?: 'column' | 'row'; error?: string; label: string };

export function FormField({ children, direction = 'column', error, label }: FormFieldProps) {
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
