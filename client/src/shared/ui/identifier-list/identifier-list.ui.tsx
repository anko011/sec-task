import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import { Badge, Box, Flex, IconButton, Text, TextField } from '@radix-ui/themes';
import type { KeyboardEventHandler, RefObject } from 'react';
import { useCallback } from 'react';
import { useIMask } from 'react-imask';

export type IdentifierBadgeProps = {
    children: string;
    onDelete?: (code: string) => void;
};

export function IdentifierBadge({ children, onDelete }: IdentifierBadgeProps) {
    return (
        <Badge asChild>
            <Flex align="center" gap="2">
                <Text as="div" size="1" weight="light">
                    {children}
                </Text>
                <IconButton onClick={() => onDelete?.(children)} size="1" type="button" variant="ghost">
                    <Cross1Icon />
                </IconButton>
            </Flex>
        </Badge>
    );
}

type IdentifierListProps = {
    definitions?: Record<string, RegExp>;
    label: string;
    maskPattern: string;
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
    overwrite?: boolean;
    placeholder: string;
    values: string[];
};

export const IdentifierList = ({
    definitions = { N: /\d/, Y: /\d/ },
    label,
    maskPattern,
    onAdd,
    onRemove,
    overwrite = true,
    placeholder,
    values
}: IdentifierListProps) => {
    const { ref, setValue, value } = useIMask(
        {
            definitions,
            lazy: false,
            mask: maskPattern,
            overwrite
        },
        {
            onAccept: (value) => {
                setValue(value);
            }
        }
    );

    const handleAdd = useCallback(() => {
        if (value.trim() !== '') {
            onAdd(value.trim());
            setValue('');
        }
    }, [value, onAdd, setValue]);

    const handleKeyDown = useCallback<KeyboardEventHandler>(
        (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
            }
        },
        [handleAdd]
    );

    return (
        <Box flexGrow="1" maxWidth="50%">
            <label>
                <Text as="div" mb="1" size="2" weight="bold">
                    {label}
                </Text>
                <Flex gap="2">
                    <TextField.Root
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        ref={ref as RefObject<HTMLInputElement>}
                        style={{ flex: 1 }}
                        value={value}
                    />
                    <IconButton onClick={handleAdd} type="button">
                        <PlusIcon />
                    </IconButton>
                </Flex>
            </label>
            <Flex gap="2" p="1" wrap="wrap">
                {values.map((value) => (
                    <IdentifierBadge
                        key={value}
                        onDelete={() => {
                            onRemove(value);
                        }}
                    >
                        {value}
                    </IdentifierBadge>
                ))}
            </Flex>
        </Box>
    );
};
