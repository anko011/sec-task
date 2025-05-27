import { AlertDialog, Button, type ButtonProps, Flex, IconButton, Strong, Text, Tooltip } from '@radix-ui/themes';
import { DrawingPinIcon, FileTextIcon } from '@radix-ui/react-icons';
import { FileUploader } from '~/shared/ui/file-uploader';
import { type ReactNode, useActionState, useState } from 'react';
import { useUsersWithOrganization } from '~/entities/users';
import { axiosInstance } from '~/shared/api';
import { AxiosError } from 'axios';
import { useFormStatus } from 'react-dom';

export type PackageRegistryButtonProps = ButtonProps;

export type PackageRegistryFormValues = {
    file?: File;
};
export type PackageRegistryFormErrors = {
    file?: string;
    parsing?: {
        line: number;
        message: string;
    }[];
};
export type PackageRegistryFormProps = {
    action: (values: PackageRegistryFormValues) => Promise<PackageRegistryFormErrors> | PackageRegistryFormErrors;
    end: ReactNode;
};

function PackageRegistryForm({ action, end }: PackageRegistryFormProps) {
    const [files, setFiles] = useState<File[]>([]);

    const submit = async (): Promise<PackageRegistryFormErrors> => {
        const file = files[0];

        return action({
            file: file
        });
    };

    const [errors, dispatch] = useActionState(submit, {});
    return (
        <form action={dispatch}>
            {!!errors.file && (
                <Text color="red" size="2">
                    {errors.file}
                </Text>
            )}
            {errors.parsing?.map((error, i) => (
                <Flex key={i} asChild gap="2">
                    <Text size="2" color="red">
                        <Strong>Строка: {error.line}</Strong>
                        {error.message}
                    </Text>
                </Flex>
            ))}
            <FileUploader files={files} onFilesUpload={setFiles} multiple={false} accept=".csv" />
            {end}
        </form>
    );
}

async function packageCreateAction(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        await axiosInstance.post('/users/package-registry', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        if (error instanceof AxiosError && error.status === 400) {
            throw error.response?.data.message;
        }
    }
}

export function Controller() {
    const { pending } = useFormStatus();
    return (
        <Flex gap="3" justify="end" mt="4">
            <AlertDialog.Cancel>
                <Button color="gray" type="button" variant="soft">
                    Отмена
                </Button>
            </AlertDialog.Cancel>

            <Button loading={pending} type="submit" variant="solid">
                Зарегистрировать
            </Button>
        </Flex>
    );
}

export function PackageRegistryButton(props: PackageRegistryButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate } = useUsersWithOrganization({}, { offset: 0, limit: 10 });

    const action = async (values: PackageRegistryFormValues): Promise<PackageRegistryFormErrors> => {
        const file = values.file;
        if (!file) return { file: 'Не выбран файл' };
        try {
            await packageCreateAction(file);
        } catch (error) {
            return { parsing: error as { line: number; message: string }[] };
        }
        await mutate();
        setIsOpen(false);
        return {};
    };

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip content="Пакетная регистрация пользователей">
                <AlertDialog.Trigger>
                    <IconButton color="green" highContrast {...props}>
                        <FileTextIcon />
                    </IconButton>
                </AlertDialog.Trigger>
            </Tooltip>

            <AlertDialog.Content aria-describedby={undefined} minWidth="max-content">
                <AlertDialog.Title>Пакетная регистрация пользователей</AlertDialog.Title>
                <PackageRegistryForm action={action} end={<Controller />} />
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
