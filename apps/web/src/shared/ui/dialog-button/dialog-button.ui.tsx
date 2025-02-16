import type { IconButtonProps } from '@radix-ui/themes';
import { Button, Dialog, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import type { ReactNode } from 'react';

export type CreateDialogButtonProps = IconButtonProps & {
    children?: ReactNode;
    dialogMinWidth?: string;
    dialogTitle: string;
    formId?: string;
    icon: ReactNode;
    tooltip: string;
};

export function DialogButton({
    children,
    dialogMinWidth = '500px',
    dialogTitle,
    formId,
    icon,
    tooltip,
    ...props
}: CreateDialogButtonProps) {
    return (
        <Dialog.Root>
            <Tooltip content={tooltip}>
                <Dialog.Trigger>
                    <IconButton highContrast {...props}>
                        {icon}
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>

            <Dialog.Content aria-describedby={undefined} minWidth={dialogMinWidth}>
                <Dialog.Title>{dialogTitle}</Dialog.Title>

                {children}

                <Flex gap="3" justify="end" mt="4">
                    <Dialog.Close>
                        <Button color="gray" variant="soft">
                            Отменить
                        </Button>
                    </Dialog.Close>

                    <Dialog.Close>
                        <Button form={formId} type="submit">
                            Сохранить
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
