import { TextField } from '@radix-ui/themes';

export type SearchFieldProps = TextField.RootProps;

export function SearchField(props: SearchFieldProps) {
    return <TextField.Root {...props}></TextField.Root>;
}
