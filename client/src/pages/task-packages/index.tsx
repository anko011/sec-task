import { Flex } from '@radix-ui/themes';

import { TaskPackageBuilder } from './ui/task-package-builder.ui';
import { Can, useAbility } from '~/features/ability';

export default function TaskPackages() {
    const ability = useAbility();
    const canEditOrDelete = ability.can('update', 'TaskPackage') || ability.can('delete', 'TaskPackage');

    return (
        <Can I="read" a="TaskPackage">
            <TaskPackageBuilder.Root>
                <Flex width="50%" gap="4" pl="3">
                    <Can I="create" a="TaskPackage">
                        <TaskPackageBuilder.Create />
                    </Can>
                    <TaskPackageBuilder.IncomingRequisiteFilter />
                    <TaskPackageBuilder.OutgoingRequisiteFilter />
                    <TaskPackageBuilder.StatusFilter />
                </Flex>
                <TaskPackageBuilder.DataTable
                    actionEndTitle={canEditOrDelete ? 'Управление' : undefined}
                    actionEnd={
                        canEditOrDelete
                            ? (taskPackage) => (
                                  <Flex gap="2" justify="center">
                                      <Can I="fix" a="TaskPackage">
                                          <TaskPackageBuilder.Fix taskPackage={taskPackage} />
                                      </Can>
                                      <Can I="update" a="TaskPackage">
                                          <TaskPackageBuilder.Edit taskPackage={taskPackage} />
                                      </Can>
                                      <Can I="delete" a="TaskPackage">
                                          <TaskPackageBuilder.Delete taskPackage={taskPackage} />
                                      </Can>
                                  </Flex>
                              )
                            : undefined
                    }
                />
            </TaskPackageBuilder.Root>
        </Can>
    );
}
