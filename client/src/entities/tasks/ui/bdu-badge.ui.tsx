import { Cross1Icon } from '@radix-ui/react-icons';
import { Badge, Flex, IconButton, Text } from '@radix-ui/themes';

export type BDUBadgeProps = {
    children: string;
    onDelete?: (code: string) => void;
};

export function BDUBadge({ children, onDelete }: BDUBadgeProps) {
    return (
        <Badge asChild>
            <Flex align="center" gap="2">
                <Text as="div" size="1" weight="light">
                    {children}
                </Text>
                <IconButton onClick={() => onDelete?.(children)} size="1" type="button" variant="ghost">
                    <Cross1Icon />
                </IconButton>
            </Flex>
        </Badge>
    );
}
