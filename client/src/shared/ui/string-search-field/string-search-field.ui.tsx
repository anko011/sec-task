import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton, TextField } from '@radix-ui/themes';
import type { ChangeEventHandler } from 'react';
import { useSearchParams } from 'react-router';

import type { SearchFieldProps } from '~/shared/ui/search-field';

export type StringSearchFieldProps = {
    property: string;
} & Omit<SearchFieldProps, 'onChange' | 'value'>;

export function StringSearchField({ property, ...props }: StringSearchFieldProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;

        setSearchParams((param) => {
            if (value === '') {
                param.delete(property);
                return param;
            }
            param.set(property, value);
            return param;
        });
    };

    const handleClickClearButton = () => {
        setSearchParams((p) => {
            p.delete(property);
            return p;
        });
    };

    return (
        <TextField.Root onChange={handleChange} value={searchParams.get(property) ?? ''} {...props}>
            <TextField.Slot side="right">
                <IconButton onClick={handleClickClearButton} size="1" variant="ghost">
                    <Cross1Icon />
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
}
