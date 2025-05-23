import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import {
    CreateTaskPackageContract,
    TaskPackageForm,
    type TaskPackageFormErrors,
    type TaskPackageFormValues,
    useTaskPackages
} from '~/entities/task-packages';
import { takeFirstElements } from '~/shared/lib';
import { axiosInstance } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';
import { Text } from '@radix-ui/themes';

export default function CreateTaskPackagePage() {
    const { create } = useTaskPackages();
    const navigate = useNavigate();
    const action = async (values: TaskPackageFormValues): Promise<TaskPackageFormErrors> => {
        const validation = CreateTaskPackageContract.safeParse({
            ...values,
            files: null,
            incomingRequisite: values.incomingRequisiteUnmasked,
            outgoingRequisite: values.outgoingRequisiteUnmasked,
            tasks: values.tasks.map((task) => ({
                ...task,
                nameId: task.name.id,
                categoryId: task.category.id
            }))
        });

        if (validation.success) {
            const taskPackage = await create({
                ...validation.data,
                incomingRequisite: values.incomingRequisiteMasked as string,
                outgoingRequisite: values.outgoingRequisiteMasked as string
            });

            const t = toast.info(
                <Text>
                    Ожидайте идет загрузка файлов...
                    <Loader />
                </Text>,
                { autoClose: false }
            );

            if (values.filesToUpload) {
                const formData = new FormData();

                for (const file of values.filesToUpload) {
                    formData.append('files', file);
                }

                await axiosInstance.post<{ filename: string }[]>(`task-packages/${taskPackage.id}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            toast.done(t);
            toast.success(`Пакет задач ${values.outgoingRequisiteMasked} успешно создан`);
            await navigate('/task-packages');
            return {};
        }
        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <TaskPackageForm action={action} />;
}
