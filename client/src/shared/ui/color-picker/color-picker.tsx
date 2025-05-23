import { Box, Grid, IconButton, Popover, Tooltip } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';

const RADIX_COLOR_NAMES = [
    'gray',
    'gold',
    'bronze',
    'brown',
    'yellow',
    'amber',
    'orange',
    'tomato',
    'red',
    'ruby',
    'crimson',
    'pink',
    'plum',
    'purple',
    'violet',
    'iris',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'jade',
    'green',
    'grass',
    'lime',
    'mint'
] as const;

export function ColorView({ color = 'gray' }: { color?: string }) {
    return (
        <Box style={{ background: `var(--${color}-6)`, borderRadius: 'var(--radius-2)' }} width="32px" height="32px" />
    );
}

export function ColorPicker({
    color,
    withEmptyColor = true,
    onChange
}: {
    color?: string;
    onChange: (color: (typeof RADIX_COLOR_NAMES)[number]) => void;
    withEmptyColor?: boolean;
}) {
    return (
        <Popover.Root>
            <Tooltip content="Выбрать цвет">
                <Popover.Trigger>
                    <IconButton
                        size="2"
                        style={{ background: color ? undefined : 'var(--gray-5)' }}
                        color={color as (typeof RADIX_COLOR_NAMES)[number]}
                    />
                </Popover.Trigger>
            </Tooltip>
            <Popover.Content>
                <Grid columns="5" align="center" justify="center" gap="2">
                    {RADIX_COLOR_NAMES.map((currColor) => (
                        <Popover.Close key={currColor}>
                            <IconButton
                                color={currColor}
                                onClick={() => {
                                    onChange(currColor);
                                }}
                            />
                        </Popover.Close>
                    ))}
                    {withEmptyColor ? (
                        <Tooltip content="Сбросить цвет">
                            <Popover.Close>
                                <IconButton
                                    highContrast
                                    style={{ background: 'var(--gray-5)' }}
                                    onClick={() => {
                                        onChange('-1' as (typeof RADIX_COLOR_NAMES)[number]);
                                    }}
                                >
                                    <Cross1Icon color="red" />
                                </IconButton>
                            </Popover.Close>
                        </Tooltip>
                    ) : null}
                </Grid>
            </Popover.Content>
        </Popover.Root>
    );
}
