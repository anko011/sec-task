import { Select } from '@radix-ui/themes';

import { rolesMapping } from '../model';

export type FilterUserRolesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (roleId?: string) => void;
};

export function UserRolesSelector({ name, defaultValue, onChange }: FilterUserRolesSelectorProps) {
    const handleChangeStatus = (value: string) => {
        onChange?.(value === '-1' ? undefined : value);
    };

    return (
        <Select.Root defaultValue={defaultValue ?? '-1'} name={name} onValueChange={handleChangeStatus}>
            <Select.Trigger />
            <Select.Content>
                <Select.Item value="-1">Не выбрано</Select.Item>
                {Object.keys(rolesMapping).map((role) => (
                    <Select.Item key={role} value={role}>
                        {rolesMapping[role as keyof typeof rolesMapping].text}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}
