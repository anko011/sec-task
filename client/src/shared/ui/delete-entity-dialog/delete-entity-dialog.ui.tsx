import type { AlertDialogContentProps, AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { Cross1Icon, TrashIcon } from '@radix-ui/react-icons';
import type { IconButtonProps } from '@radix-ui/themes';
import { AlertDialog, Button, Flex, IconButton, TextField, Tooltip } from '@radix-ui/themes';
import type { ChangeEventHandler } from 'react';
import { createContext, use, useState } from 'react';
import { useFormStatus } from 'react-dom';

type ConfirmationDialogContext = {
    title: string;
    confirmation: string;
    isConfirmed: boolean;
    setIsConfirmed: (isConfirmed: boolean) => void;
};

export const ConfirmationDialogContext = createContext<ConfirmationDialogContext | null>(null);

type RootProps = AlertDialogProps & { title: string; confirmation: string };

export function Root({ title, confirmation, ...props }: RootProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);

    return (
        <ConfirmationDialogContext.Provider value={{ title, confirmation, isConfirmed, setIsConfirmed }}>
            <AlertDialog.Root {...props}></AlertDialog.Root>
        </ConfirmationDialogContext.Provider>
    );
}

type ContentProps = AlertDialogContentProps;

export function Content({ children, ...props }: ContentProps) {
    const ctx = use(ConfirmationDialogContext);
    if (ctx == null) throw new Error('Content should be mounted in Root Component');
    const { title } = ctx;

    return (
        <AlertDialog.Content aria-describedby={undefined} {...props}>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <Flex direction="column">{children}</Flex>
        </AlertDialog.Content>
    );
}

export function ConfirmationField() {
    const ctx = use(ConfirmationDialogContext);
    if (ctx == null) throw new Error('ConfirmationField should be mounted in Root Component');
    const { confirmation, setIsConfirmed } = ctx;

    const [value, setValue] = useState('');

    const onChangeValue: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
        setIsConfirmed(e.target.value.trim() === confirmation.trim());
    };

    const onClickClearButton = () => {
        setValue('');
        setIsConfirmed(false);
    };

    return (
        <TextField.Root onChange={onChangeValue} value={value}>
            <TextField.Slot side="right">
                <IconButton size="1" type="button" variant="ghost">
                    <Cross1Icon onClick={onClickClearButton} />
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
}

export function Controller() {
    const ctx = use(ConfirmationDialogContext);
    if (ctx == null) throw new Error('Content should be mounted in Root Component');
    const { isConfirmed } = ctx;

    return (
        <Flex gap="3" justify="end" mt="4">
            <AlertDialog.Cancel>
                <Button color="gray" type="button" variant="soft">
                    Отмена
                </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
                <Button color="red" disabled={!isConfirmed} type="submit" variant="solid">
                    Удалить
                </Button>
            </AlertDialog.Action>
        </Flex>
    );
}

type TriggerProps = IconButtonProps & { tooltip: string };

export function Trigger({ color = 'red', tooltip, ...props }: TriggerProps) {
    const { pending } = useFormStatus();

    return (
        <Tooltip content={tooltip}>
            <AlertDialog.Trigger>
                <IconButton color={color} loading={pending} {...props}>
                    <TrashIcon />
                </IconButton>
            </AlertDialog.Trigger>
        </Tooltip>
    );
}
