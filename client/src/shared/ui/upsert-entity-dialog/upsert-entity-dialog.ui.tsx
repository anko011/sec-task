import type { IconButtonProps } from '@radix-ui/themes';
import { Button, Dialog, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import { createContext, use } from 'react';
import { useFormStatus } from 'react-dom';

type RootProps = Dialog.RootProps & {
    title: string;
};

type UpsertEntityDialogContext = {
    title: string;
};

type ContentProps = Dialog.ContentProps;

const UpsertEntityDialogContext = createContext<UpsertEntityDialogContext | null>(null);

export function Root({ title, ...props }: RootProps) {
    return (
        <UpsertEntityDialogContext.Provider value={{ title }}>
            <Dialog.Root {...props}></Dialog.Root>
        </UpsertEntityDialogContext.Provider>
    );
}

export function Content({ children, ...props }: ContentProps) {
    const ctx = use(UpsertEntityDialogContext);
    if (ctx == null) throw new Error('Content should be mounted inside Root component');
    const { title } = ctx;
    return (
        <Dialog.Content aria-describedby={undefined} {...props}>
            <Dialog.Title>{title}</Dialog.Title>
            <Flex direction="column">{children}</Flex>
        </Dialog.Content>
    );
}

export function Controller() {
    const { pending } = useFormStatus();
    return (
        <Flex gap="3" justify="end" mt="4">
            <Dialog.Close>
                <Button color="gray" type="button" variant="soft">
                    Отмена
                </Button>
            </Dialog.Close>
            <Button color="blue" highContrast loading={pending} type="submit" variant="solid">
                Сохранить
            </Button>
        </Flex>
    );
}

type TriggerProps = IconButtonProps & { tooltip: string };

export function Trigger({ color = 'blue', tooltip, ...props }: TriggerProps) {
    const { pending } = useFormStatus();

    return (
        <Tooltip content={tooltip}>
            <Dialog.Trigger>
                <IconButton color={color} highContrast loading={pending} {...props} />
            </Dialog.Trigger>
        </Tooltip>
    );
}
