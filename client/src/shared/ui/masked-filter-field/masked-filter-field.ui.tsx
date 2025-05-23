import { Flex, Text, type TextField } from '@radix-ui/themes';
import type { ChangeEventHandler, RefObject } from 'react';
import type { InputMaskElement } from 'imask';

import { ClearableTextField } from '../clearable-text-field';

export type MaskedFilterFieldProps = Omit<TextField.RootProps, 'onChange'> & {
    label: string;
    ref?: RefObject<HTMLInputElement | InputMaskElement | null>;
    onClear?: () => void;
    onChange?: (value: string) => void;
};

export function MaskedFilterField({ label, ref, onChange, ...props }: MaskedFilterFieldProps) {
    const onChangeValue: ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange?.(e.target.value);
    };

    return (
        <Flex asChild align="center" gap="2" flexGrow="1">
            <label>
                <Text size="2" wrap="nowrap">
                    {label}
                </Text>
                <ClearableTextField
                    style={{ width: '100%', minWidth: '200px' }}
                    ref={ref}
                    onChange={onChangeValue}
                    {...props}
                />
            </label>
        </Flex>
    );
}
