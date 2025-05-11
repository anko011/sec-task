import { Flex } from '@radix-ui/themes';
import { Suspense } from 'react';

import { PaginatedTaskPackagesTable } from '~/entities/task-packages';
import { Can, useAbility } from '~/features/ability';
import { CreateTaskPackageButton } from '~/features/task-packages/create';
import { DeleteTaskPackageButton } from '~/features/task-packages/delete';
import { EditTaskPackageButton } from '~/features/task-packages/edit';
import { FixTaskPackageButton } from '~/features/task-packages/fix';
import { SignTaskPackageButton } from '~/features/task-packages/sign';
import { Loader } from '~/shared/ui/loader';

export function TaskPackagesPage() {
    const ability = useAbility();
    return (
        <Can a="TaskPackage" I="read">
            <Flex direction="column" gap="4" minHeight="100%">
                <Can a="TaskPackage" I="create">
                    <Flex align="center" gap="2">
                        <CreateTaskPackageButton />
                    </Flex>
                </Can>

                <Suspense fallback={<Loader />}>
                    <PaginatedTaskPackagesTable
                        actionEnd={
                            ability.can('update', 'TaskPackage') || ability.can('delete', 'TaskPackage')
                                ? {
                                      title: 'Блок управления',
                                      action: (taskPackage) => (
                                          <Flex gap="2">
                                              <Can a="TaskPackage" I="update">
                                                  <EditTaskPackageButton taskPackage={taskPackage} />
                                              </Can>
                                              <Can a="TaskPackage" I="delete">
                                                  <DeleteTaskPackageButton taskPackage={taskPackage} />
                                              </Can>
                                              <FixTaskPackageButton />
                                              <SignTaskPackageButton />
                                          </Flex>
                                      )
                                  }
                                : undefined
                        }
                    />
                </Suspense>
            </Flex>
        </Can>
    );
}
