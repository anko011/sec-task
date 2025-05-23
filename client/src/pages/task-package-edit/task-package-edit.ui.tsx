import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
    EditTaskPackageContract,
    TaskPackageForm,
    type TaskPackageFormErrors,
    type TaskPackageFormValues,
    useTaskPackage
} from '~/entities/task-packages';

import { axiosInstance } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';
import { Text } from '@radix-ui/themes';

export default function EditTaskPackagePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    if (id == null) throw new Error('Not valid package ID');

    const { data, isLoading, mutate } = useTaskPackage(id);

    const action = async (values: TaskPackageFormValues): Promise<TaskPackageFormErrors> => {
        const validation = EditTaskPackageContract.safeParse({
            ...values,
            incomingRequisite: values.incomingRequisiteUnmasked,
            outgoingRequisite: values.outgoingRequisiteUnmasked,
            attachmentIds: values.attachments.map((a) => a.id),
            tasks: values.tasks.map((task) => ({
                ...task,
                nameId: task.name.id,
                categoryId: task.category.id
            }))
        });

        if (validation.success) {
            try {
                await axiosInstance.patch(`/task-packages/${id}`, {
                    ...validation.data,
                    incomingRequisite: values.incomingRequisiteMasked,
                    outgoingRequisite: values.outgoingRequisiteMasked,
                    tasks: values.tasks.map((task) => ({
                        ...task,
                        nameId: task.name.id,
                        categoryId: task.category.id
                    }))
                });

                if (values.filesToUpload) {
                    const formData = new FormData();

                    for (const file of values.filesToUpload) {
                        formData.append('files', file);
                    }

                    const t = toast.info(
                        <Text>
                            Ожидайте идет загрузка файлов...
                            <Loader />
                        </Text>,
                        { autoClose: false }
                    );

                    await axiosInstance.post<
                        {
                            filename: string;
                        }[]
                    >(`task-packages/${id}/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    toast.done(t);
                }

                await mutate();
                toast.success('Пакет задач успешно обновлен');
                await navigate(`/task-packages`);
            } catch (e) {
                if (e instanceof Error) toast.error(e.message);
                throw e;
            }
        }

        return {};
    };

    if (isLoading) return <Loader minHeight="100%" />;

    return <TaskPackageForm action={action} taskPackage={data} />;
}
