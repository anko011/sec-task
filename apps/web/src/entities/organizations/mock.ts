/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { organizationTypes } from '../organization-types/mock';

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
