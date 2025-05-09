/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TaskStatus } from '~/entities/tasks/model/task';

import { organizationTypes } from '../organization-types/mock';
import type { StatusChange } from './model/change-status';

export const organizations = {
    'a1b2c3d4-5678-90ab-cdef-1234567890ab': {
        id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        type: organizationTypes['12b19de3-dd9e-45f3-b6d5-cb4274dc528f']!,
        name: 'Администрация Центрального района г. Чита',
        isArchived: true
    },
    'a7b8c9d0-1234-56ef-f789-0123456789fa': {
        id: 'a7b8c9d0-1234-56ef-f789-0123456789fa',
        type: organizationTypes['3e7bb294-3a98-43e8-8721-64c3b2811f6e']!,
        name: 'Городская поликлиника №3 г. Чита',
        isArchived: false
    },
    'b2c3d4e5-6789-01ab-cdef-2345678901bc': {
        id: 'b2c3d4e5-6789-01ab-cdef-2345678901bc',
        type: organizationTypes['3e7bb294-3a98-43e8-8721-64c3b2811f6e']!,
        name: 'Департамент образования г. Чита',
        isArchived: false
    },
    'b8c9d0e1-2345-67fa-f890-1234567890ab': {
        id: 'b8c9d0e1-2345-67fa-f890-1234567890ab',
        type: organizationTypes['535aabe9-135a-43af-b8c9-5b75424a9824']!,
        name: 'Администрация Железнодорожного района г. Чита',
        isArchived: false
    },
    'c9bf9e57-1685-4c89-bafb-ff5af830be8a': {
        id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
        type: organizationTypes['535aabe9-135a-43af-b8c9-5b75424a9824']!,
        name: 'Министерство здравоохранения Забайкальского края',
        isArchived: false
    },
    'd4e5f6a7-8901-23bc-def4-5678901234cd': {
        id: 'd4e5f6a7-8901-23bc-def4-5678901234cd',
        type: organizationTypes['3e7bb294-3a98-43e8-8721-64c3b2811f6e']!,
        name: 'Центр социальной помощи семье и детям г. Чита',
        isArchived: false
    },
    'e4a1c7d2-3f8b-4e5d-9c6f-1b2e3c4d5e6f': {
        id: 'e4a1c7d2-3f8b-4e5d-9c6f-1b2e3c4d5e6f',
        type: organizationTypes['3e7bb294-3a98-43e8-8721-64c3b2811f6e']!,
        name: 'Городская больница №1 г. Чита',
        isArchived: false
    },
    'e5f6a7b8-9012-34cd-ef56-7890123456de': {
        id: 'e5f6a7b8-9012-34cd-ef56-7890123456de',
        type: organizationTypes['12b19de3-dd9e-45f3-b6d5-cb4274dc528f']!,
        name: 'Администрация поселка Атамановка (г. Чита)',
        isArchived: true
    },
    'f6a7b8c9-0123-45de-f678-9012345678ef': {
        id: 'f6a7b8c9-0123-45de-f678-9012345678ef',
        type: organizationTypes['535aabe9-135a-43af-b8c9-5b75424a9824']!,
        name: 'Министерство транспорта Забайкальского края',
        isArchived: false
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d479': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        type: organizationTypes['12b19de3-dd9e-45f3-b6d5-cb4274dc528f']!,
        name: 'Администрация города Чита',
        isArchived: false
    }
};

export const statusChanges: StatusChange[] = [
    {
        id: '1',
        changedAt: new Date(2025, 5, 20),
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        newStatus: TaskStatus.NEW,
        organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        taskId: '6ba7b810-9dad-11d1-80b4-00c04fd430c801'
    },
    {
        id: '2',
        changedAt: new Date(2025, 6, 21),
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        newStatus: TaskStatus.IN_PROGRESS,
        oldStatus: TaskStatus.NEW,
        organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        taskId: '6ba7b810-9dad-11d1-80b4-00c04fd430c801'
    },
    {
        id: '3',
        changedAt: new Date(2025, 6, 22),
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        newStatus: TaskStatus.COMPENSATED,
        oldStatus: TaskStatus.IN_PROGRESS,
        organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        taskId: '6ba7b810-9dad-11d1-80b4-00c04fd430c801'
    },

    {
        id: '4',
        changedAt: new Date(2025, 5, 20),
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        newStatus: TaskStatus.NEW,
        organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        taskId: '6ba7b810-9dad-11d1-80b4-00c04fd430c801'
    },
    {
        id: '5',
        changedAt: new Date(2025, 6, 21),
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        newStatus: TaskStatus.IN_PROGRESS,
        oldStatus: TaskStatus.NEW,
        organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        taskId: '6ba7b810-9dad-11d1-80b4-00c04fd430c801'
    },
    {
        id: '6',
        changedAt: new Date(2025, 6, 22),
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        newStatus: TaskStatus.NO_ACTUAL,
        oldStatus: TaskStatus.IN_PROGRESS,
        organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        taskId: '6ba7b810-9dad-11d1-80b4-00c04fd430c801'
    }
];
