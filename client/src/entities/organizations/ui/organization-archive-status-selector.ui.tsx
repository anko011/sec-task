import { Select } from '@radix-ui/themes';

export type OrganizationArchiveStatusSelectorProps = {
    onChange?: (isArchived?: boolean) => void;
};

export function OrganizationArchiveStatusSelector({ onChange }: OrganizationArchiveStatusSelectorProps) {
    const handleChangeStatus = (value: 'true' | 'false' | '-1') => {
        const status = value === 'true' ? true : value === 'false' ? false : undefined;
        onChange?.(status);
    };

    return (
        <Select.Root defaultValue="-1" onValueChange={handleChangeStatus}>
            <Select.Trigger />
            <Select.Content>
                <Select.Item value="-1">Не выбрано</Select.Item>
                <Select.Item value="true">Архивная</Select.Item>
                <Select.Item value="false">Активная</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}
