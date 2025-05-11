import { Flex, Select, Text } from '@radix-ui/themes';
import { useSearchParams } from 'react-router';

export type SelectSearchFieldProps = {
    items: { label: string; value: string }[];
    label: string;
    property: string;
};

export function SelectSearchField({ items, label, property }: SelectSearchFieldProps) {
    const [search, setSearchParams] = useSearchParams();
    const handleChange = (value: string) => {
        setSearchParams((param) => {
            if (value === '-1') {
                param.delete(property);
                return param;
            }
            param.set(property, value);
            return param;
        });
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">{label}</Text>
                <Select.Root defaultValue={search.get(property) ?? '-1'} onValueChange={handleChange}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        {items.map((item) => (
                            <Select.Item key={item.value} value={item.value}>
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
