import { CheckboxGroup, DataList, Flex, TextField } from '@radix-ui/themes';
import { Suspense, use } from 'react';

import { SearchableOrganizationTable } from '~/entities/organizations';
import type { TaskPackage } from '~/entities/task-packages';
import { SearchableTaskDTOList } from '~/entities/tasks';
import { FileUploader } from '~/shared/ui/file-uploader';
import { Loader } from '~/shared/ui/loader';

export function TaskPackageForm({ data }: { data?: Promise<TaskPackage> }) {
    const taskPackage = !(data == null) ? use(data) : null;
    return (
        <Flex direction="column" gap="4" minHeight="100%" p="4">
            <Suspense fallback={<Loader />}>
                <form>
                    <DataList.Root size="2">
                        <DataList.Item align="center">
                            <DataList.Label>Входящий реквизит</DataList.Label>
                            <DataList.Value>
                                <TextField.Root
                                    defaultValue={taskPackage?.incomingRequisite}
                                    placeholder="Введите входящий реквизит"
                                    style={{ width: '100%' }}
                                />
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Исходящий реквизит</DataList.Label>
                            <DataList.Value>
                                <TextField.Root
                                    defaultValue={taskPackage?.outgoingRequisite}
                                    placeholder="Введите исходящий реквизит"
                                    style={{ width: '100%' }}
                                />
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Прикрепляемые файлы</DataList.Label>
                            <DataList.Value>
                                <FileUploader />
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Исполнители</DataList.Label>
                            <Flex asChild direction="column" gap="2">
                                <DataList.Value>
                                    <CheckboxGroup.Root>
                                        <SearchableOrganizationTable
                                            actionStart={{
                                                title: '',
                                                action: (organization) => (
                                                    <CheckboxGroup.Item key={organization.id} value={organization.id} />
                                                )
                                            }}
                                        />
                                    </CheckboxGroup.Root>
                                </DataList.Value>
                            </Flex>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Задачи</DataList.Label>
                            <Flex asChild direction="column" gap="2">
                                <DataList.Value>
                                    <SearchableTaskDTOList />
                                </DataList.Value>
                            </Flex>
                        </DataList.Item>
                    </DataList.Root>
                </form>
            </Suspense>
        </Flex>
    );
}
