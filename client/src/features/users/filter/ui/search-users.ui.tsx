import { Role } from '~/entities/users';
import { SelectSearchField } from '~/shared/ui/select-search-field';
import { StringSearchField } from '~/shared/ui/string-search-field';

export function SearchUsersByEmail() {
    return <StringSearchField placeholder="Введите email..." property="email" />;
}

export function SearchUsersByFirstName() {
    return <StringSearchField placeholder="Введите имя..." property="firstName" />;
}

export function SearchUsersBySecondName() {
    return <StringSearchField placeholder="Введите фамилию..." property="secondName" />;
}

export function SearchUsersByPatronymic() {
    return <StringSearchField placeholder="Введите отчество..." property="patronymic" />;
}

export function SearchUsersByOrganizationName() {
    return <StringSearchField placeholder="Введите название организации..." property="organizationName" />;
}

export function SearchUsersByRole() {
    return (
        <SelectSearchField
            items={[
                { label: 'Администратор', value: Role.Admin },
                { label: 'Оператор', value: Role.Operator },
                { label: 'Исполнитель', value: Role.Assigner }
            ]}
            label="Роль"
            property="role"
        />
    );
}
