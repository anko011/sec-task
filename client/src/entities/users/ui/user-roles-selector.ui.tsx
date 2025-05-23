import { Select } from '@radix-ui/themes';

import { type Role, rolesMapping } from '../model';

export type FilterUserRolesSelectorProps = Select.RootProps & {
    onChange?: (role?: Role) => void;
};

export function UserRolesSelector({ defaultValue, onChange, ...props }: FilterUserRolesSelectorProps) {
    const handleChangeStatus = (value: string) => {
        onChange?.(value === '-1' ? undefined : (value as Role));
    };

    return (
        <Select.Root defaultValue={defaultValue ?? '-1'} onValueChange={handleChangeStatus} {...props}>
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
