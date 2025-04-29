import { Flex, Select, Text } from '@radix-ui/themes';

export type FilterOrganizationArchiveStatusSelectorProps = {
    onChange?: (isArchived?: boolean) => void;
};

export function FilterOrganizationArchiveStatusSelector({ onChange }: FilterOrganizationArchiveStatusSelectorProps) {
    const handleChangeStatus = (value: 'true' | 'false' | '-1') => {
        const status = value === 'true' ? true : value === 'false' ? false : undefined;
        onChange?.(status);
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Статус архивации</Text>
                <Select.Root defaultValue="-1" onValueChange={handleChangeStatus}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Select.Item value="true">Архивная</Select.Item>
                        <Select.Item value="false">Активная</Select.Item>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
