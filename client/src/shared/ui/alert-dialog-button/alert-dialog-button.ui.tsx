import type { IconButtonProps } from '@radix-ui/themes';
import { AlertDialog, Button, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import type { ReactNode } from 'react';

export type AlertDialogButtonProps = IconButtonProps & {
    dialogTitle: string;
    disabledSubmit?: boolean;
    icon: ReactNode;
    tooltip: string;
};

export function AlertDialogButton({
    children,
    dialogTitle,
    disabledSubmit,
    icon,
    tooltip,
    ...props
}: AlertDialogButtonProps) {
    return (
        <AlertDialog.Root>
            <Tooltip content={tooltip}>
                <AlertDialog.Trigger>
                    <IconButton {...props}>{icon}</IconButton>
                </AlertDialog.Trigger>
            </Tooltip>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>{dialogTitle}</AlertDialog.Title>
                <AlertDialog.Description size="2">{children}</AlertDialog.Description>

                <Flex gap="3" justify="end" mt="4">
                    <AlertDialog.Cancel>
                        <Button color="gray" variant="soft">
                            Отмена
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button color="red" disabled={disabledSubmit} variant="solid">
                            Удалить
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
