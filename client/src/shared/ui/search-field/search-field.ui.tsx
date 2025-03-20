import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { IconButton, TextField } from '@radix-ui/themes';

export type SearchFieldProps = TextField.RootProps;

export function SearchField(props: SearchFieldProps) {
    return (
        <TextField.Root {...props}>
            <TextField.Slot>
                <IconButton size="1" variant="ghost">
                    <MagnifyingGlassIcon />
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
}
