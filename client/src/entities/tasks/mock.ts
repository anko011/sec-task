import { organizations } from '~/entities/organizations';

import { taskCategories } from '../task-categories/mock';
import { type Task, TaskDangerStatus, TaskStatus } from './model/task';

export const tasks: Record<string, Task> = {
    '6ba7b810-9dad-11d1-80b4-00c04fd430c801': {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c801',
        description: 'Провести обучение сотрудников по основам ИБ.',
        name: 'Обучение сотрудников',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '789515',
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    },
    '6ba7b810-9dad-11d1-80b4-00c04fd430c802': {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c802',
        description: 'Проанализировать уязвимости в корпоративной сети.',
        name: 'Анализ уязвимостей',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '958595',
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    },
    '6ba7b810-9dad-11d1-80b4-00c04fd430c803': {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c803',
        description: 'Настроить SIEM-систему для мониторинга безопасности.',
        name: 'Настройка SIEM-системы',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.MEDIUM,
        number: '152636',
        packageId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    },

    '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a01': {
        id: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a01',
        description: 'Обновить серверное оборудование до последних версий.',
        name: 'Обновление серверного оборудования',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '715896',
        packageId: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a'
    },
    '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a02': {
        id: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a02',
        description: 'Перейти на новую версию операционной системы на всех рабочих станциях.',
        name: 'Обновление операционных систем',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '128595',
        packageId: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a'
    },
    '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a03': {
        id: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a03',
        description: 'Модернизировать сетевое оборудование для повышения пропускной способности.',
        name: 'Модернизация сетевого оборудования',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.MEDIUM,
        number: '127965',
        packageId: '2e8b4a7a-5e3a-4b5e-825b-8a2b9a1f3e1a'
    },

    '550e8400-e29b-41d4-a716-446655440001': {
        id: '550e8400-e29b-41d4-a716-446655440001',
        description: 'Провести аудит существующих политик информационной безопасности.',
        name: 'Аудит политик безопасности',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '089585',
        packageId: '550e8400-e29b-41d4-a716-446655440000'
    },
    '550e8400-e29b-41d4-a716-446655440002': {
        id: '550e8400-e29b-41d4-a716-446655440002',
        description: 'Выполнить тестирование на проникновение для выявления уязвимостей.',
        name: 'Тестирование на проникновение',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '195485',
        packageId: '550e8400-e29b-41d4-a716-446655440000'
    },
    '550e8400-e29b-41d4-a716-446655440003': {
        id: '550e8400-e29b-41d4-a716-446655440003',
        description: 'Обновить правила фаервола для блокировки новых угроз.',
        name: 'Обновление правил фаервола',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '174836',
        packageId: '550e8400-e29b-41d4-a716-446655440000'
    },
    'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p601': {
        id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p601',
        description: 'Провести анализ рисков для корпоративной сети.',
        name: 'Анализ рисков корпоративной сети',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '015985',
        packageId: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
    },
    'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p602': {
        id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p602',
        description: 'Оценить риски, связанные с использованием облачных сервисов.',
        name: 'Оценка рисков облачных сервисов',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '745296',
        packageId: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
    },
    'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p603': {
        id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p603',
        description: 'Провести анализ рисков утечки конфиденциальных данных.',
        name: 'Анализ рисков утечки данных',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '159357',
        packageId: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
    },
    'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q701': {
        id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q701',
        description: 'Настроить систему мониторинга для обнаружения подозрительной активности в сети.',
        name: 'Настройка системы мониторинга',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.MEDIUM,
        number: '137946',
        packageId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
    },
    'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q702': {
        id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q702',
        description: 'Разработать процедуру реагирования на инциденты безопасности.',
        name: 'Разработка процедуры реагирования',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '142536',
        packageId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
    },
    'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q703': {
        id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q703',
        description: 'Провести анализ логов для выявления потенциальных угроз.',
        name: 'Анализ логов безопасности',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '785612',
        packageId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
    },
    'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r801': {
        id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r801',
        description: 'Настроить регулярное резервное копирование критически важных данных.',
        name: 'Настройка резервного копирования',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '174778',
        packageId: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8'
    },
    'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r802': {
        id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r802',
        description: 'Проверить целостность резервных копий и возможность восстановления данных.',
        name: 'Проверка резервных копий',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '356162',
        packageId: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8'
    },
    'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r803': {
        id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r803',
        description: 'Разработать политику хранения и удаления резервных копий.',
        name: 'Разработка политики хранения',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.MEDIUM,
        number: '258595',
        packageId: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8'
    },
    'c9bf9e57-1685-4c89-bafb-ff5af830be8a01': {
        id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a01',
        description: 'Разработать программу обучения по основам информационной безопасности.',
        name: 'Разработка программы обучения',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '155915',
        packageId: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a'
    },
    'c9bf9e57-1685-4c89-bafb-ff5af830be8a02': {
        id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a02',
        description: 'Провести тренинг по выявлению фишинговых атак.',
        name: 'Тренинг по фишингу',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '002585',
        packageId: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a'
    },
    'c9bf9e57-1685-4c89-bafb-ff5af830be8a03': {
        id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a03',
        description: 'Организовать тестирование сотрудников на знание политик ИБ.',
        name: 'Тестирование сотрудников',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '989898',
        packageId: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a'
    },
    'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s901': {
        id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s901',
        description: 'Обновить операционные системы на всех рабочих станциях до последней версии.',
        name: 'Обновление ОС',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.MEDIUM,
        number: '457845',
        packageId: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9'
    },
    'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s902': {
        id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s902',
        description: 'Обновить антивирусное ПО на всех корпоративных устройствах.',
        name: 'Обновление антивируса',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '454545',
        packageId: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9'
    },
    'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s903': {
        id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s903',
        description: 'Обновить специализированное ПО для отдела разработки.',
        name: 'Обновление ПО разработки',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '151515',
        packageId: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9'
    },
    'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t001': {
        id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t001',
        description: 'Настроить правила фильтрации входящего и исходящего трафика.',
        name: 'Настройка правил фаервола',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '020508',
        packageId: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0'
    },
    'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t002': {
        id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t002',
        description: 'Провести тестирование настроек фаервола на предмет уязвимостей.',
        name: 'Тестирование фаервола',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.MEDIUM,
        number: '986564',
        packageId: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0'
    },
    'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t003': {
        id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t003',
        description: 'Настроить логирование и мониторинг событий фаервола.',
        name: 'Настройка логирования',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '154879',
        packageId: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0'
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d47901': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d47901',
        description: 'Разработать политику управления доступом.',
        name: 'Политика управления доступом',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: [],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '020506',
        packageId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d47902': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d47902',
        description: 'Разработать политику резервного копирования.',
        name: 'Политика резервного копирования',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: [],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '545986',
        packageId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d47903': {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d47903',
        description: 'Разработать политику реагирования на инциденты.',
        name: 'Политика реагирования на инциденты',
        additionalInformation: '',
        assigneeProgresses: [
            {
                organization: organizations['a1b2c3d4-5678-90ab-cdef-1234567890ab'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['b2c3d4e5-6789-01ab-cdef-2345678901bc'],
                status: TaskStatus.NEW
            },
            {
                organization: organizations['d4e5f6a7-8901-23bc-def4-5678901234cd'],
                status: TaskStatus.NEW
            }
        ],
        BDU: [],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c803'],
        CVE: [],
        dangerStatus: TaskDangerStatus.LOW,
        number: '155665',
        packageId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    }
};
