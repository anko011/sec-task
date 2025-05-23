import { IconButton, TextField } from '@radix-ui/themes';
import { type RefObject, useCallback, useRef } from 'react';
import type { InputMaskElement } from 'imask';
import { Cross1Icon } from '@radix-ui/react-icons';

export type ClearableTextFieldProps = TextField.RootProps & {
    ref?: RefObject<HTMLInputElement | InputMaskElement | null>;
    onClear?: () => void;
};

export function ClearableTextField({ onClear, ref, ...props }: ClearableTextFieldProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const refMerge = useCallback(
        (element: HTMLInputElement) => {
            inputRef.current = element;
            if (!ref) return;
            ref.current = element;
        },
        [ref, inputRef]
    );

    const onClickClear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onClear?.();
    };

    return (
        <TextField.Root ref={refMerge} {...props}>
            <TextField.Slot side="right">
                <IconButton type="button" size="1" variant="ghost" onClick={onClickClear}>
                    <Cross1Icon />
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
}
