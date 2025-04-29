import { tasks } from '~/entities/tasks/mock';

import { type BaseDocument, TaskPackageStatus } from './model/task-package';

const baseDocument1: BaseDocument = {
    name: 'Документ по ИБ №1',
    url: '/'
};

const baseDocument2: BaseDocument = {
    name: 'Документ по ИБ №2',
    url: '/'
};

export const taskPackages = {
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8': {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        name: 'Пакет задач по тестированию на проникновение',
        baseDocument: baseDocument2,
        incomingRequisite: '789568-20.05.25',
        outgoingRequisite: '789568-27.05.25',
        status: TaskPackageStatus.ACTIVE,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === '6ba7b810-9dad-11d1-80b4-00c04fd430c8').length
    },
    '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a': {
        id: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a',
        name: 'Пакет задач по обновлению инфраструктуры',
        baseDocument: baseDocument2,
        incomingRequisite: '325689-20.05.25',
        outgoingRequisite: '325689-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a').length
    },
    '550e8400-e29b-41d4-a716-446655440000': {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Пакет задач по аудиту ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '759862-20.05.25',
        outgoingRequisite: '759862-27.05.25',
        status: TaskPackageStatus.ACTIVE,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === '550e8400-e29b-41d4-a716-446655440000').length
    },
    'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6': {
        id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        name: 'Пакет задач по анализу рисков',
        baseDocument: baseDocument1,
        incomingRequisite: '321564-20.05.25',
        outgoingRequisite: '321564-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6').length
    },
    'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7': {
        id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        name: 'Пакет задач по мониторингу инцидентов',
        baseDocument: baseDocument2,
        incomingRequisite: '497325-20.05.25',
        outgoingRequisite: '497325-27.05.25',
        status: TaskPackageStatus.ACTIVE,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7').length
    },
    'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8': {
        id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
        name: 'Пакет задач по резервному копированию',
        baseDocument: baseDocument1,
        incomingRequisite: '157946-20.05.25',
        outgoingRequisite: '157946-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8').length
    },
    'c9bf9e57-1685-4c89-bafb-ff5af830be8a': {
        id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
        name: 'Пакет задач по обучению сотрудников',
        baseDocument: baseDocument2,
        incomingRequisite: '153795-20.05.25',
        outgoingRequisite: '153795-27.05.25',
        status: TaskPackageStatus.ACTIVE,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'c9bf9e57-1685-4c89-bafb-ff5af830be8a').length
    },
    'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9': {
        id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
        name: 'Пакет задач по обновлению ПО',
        baseDocument: baseDocument1,
        incomingRequisite: '328919-20.05.25',
        outgoingRequisite: '328919-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9').length
    },
    'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0': {
        id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
        name: 'Пакет задач по настройке фаервола',
        baseDocument: baseDocument2,
        incomingRequisite: '558295-20.05.25',
        outgoingRequisite: '558295-27.05.25',
        status: TaskPackageStatus.ACTIVE,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d471': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d471',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '466625-20.05.25',
        outgoingRequisite: '466625-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d471').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d472': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d472',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '959559-20.05.25',
        outgoingRequisite: '959559-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d472').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d473': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d473',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '784585-20.05.25',
        outgoingRequisite: '784585-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d473').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d474': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d474',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '916596-20.05.25',
        outgoingRequisite: '916596-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d474').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d475': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d475',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '727173-20.05.25',
        outgoingRequisite: '727173-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d475').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d476': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d476',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '929396-20.05.25',
        outgoingRequisite: '929396-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d476').length
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d477': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d477',
        name: 'Пакет задач по разработке политик ИБ',
        baseDocument: baseDocument1,
        incomingRequisite: '152837-20.05.25',
        outgoingRequisite: '152837-27.05.25',
        status: TaskPackageStatus.FIXED,
        tasksNumber: Object.values(tasks).filter((t) => t.packageId === 'f47ac10b-58cc-4372-a567-0e02b2c3d477').length
    }
};
