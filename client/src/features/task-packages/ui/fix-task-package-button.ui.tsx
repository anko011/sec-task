import { DrawingPinIcon } from '@radix-ui/react-icons';
import { AlertDialog, Button, Flex, IconButton, type IconButtonProps, Strong, Text, Tooltip } from '@radix-ui/themes';
import { type TaskPackage, TaskPackageStatus } from '~/entities/task-packages';
import { ClearableTextField } from '~/shared/ui/clearable-text-field';
import { type ChangeEvent, useState } from 'react';

export type FixTaskPackageButtonProps = IconButtonProps & {
    taskPackage: TaskPackage;
    action: () => Promise<void> | void;
};

export function FixTaskPackageButton({ taskPackage, action, ...props }: FixTaskPackageButtonProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const onChangeConfirmationField = (e: ChangeEvent<HTMLInputElement>) => {
        setIsConfirmed(e.target.value === taskPackage.outgoingRequisite);
    };

    const canFix = taskPackage.completionPercentage === 100;
    const isFixed = taskPackage.status === TaskPackageStatus.FIXED;

    const tooltip = isFixed
        ? 'Пакет задач уже зафиксирован'
        : canFix
          ? 'Зафиксировать пакет задач'
          : 'Невозможно зафиксировать пакет задач пока не выполнены все задачи';

    return (
        <AlertDialog.Root>
            <Tooltip content={tooltip}>
                <AlertDialog.Trigger>
                    <IconButton disabled={!canFix || isFixed} color="yellow" highContrast {...props}>
                        <DrawingPinIcon />
                    </IconButton>
                </AlertDialog.Trigger>
            </Tooltip>

            <AlertDialog.Content aria-describedby={undefined} minWidth="max-content">
                <AlertDialog.Title>Фиксация пакета задач</AlertDialog.Title>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите зафиксировать пакет:{' '}
                            <Strong>{taskPackage.outgoingRequisite}</Strong>
                        </Text>
                        <Text>
                            Для фиксации введите: <Strong>{taskPackage.outgoingRequisite}</Strong>
                        </Text>
                        <ClearableTextField onChange={onChangeConfirmationField} />
                        <Flex gap="3" justify="end" mt="4">
                            <AlertDialog.Cancel>
                                <Button color="gray" type="button" variant="soft">
                                    Отмена
                                </Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button disabled={!isConfirmed} type="submit" variant="solid">
                                    Зафиксировать
                                </Button>
                            </AlertDialog.Action>
                        </Flex>
                    </form>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
