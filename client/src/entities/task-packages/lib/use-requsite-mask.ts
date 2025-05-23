import { useIMask } from 'react-imask';

export function useRequisiteMask(props?: Parameters<typeof useIMask>[1]) {
    return useIMask(
        {
            definitions: { 0: /\d/ },
            lazy: false,
            mask: '№ 000/000-00 от 00.00.0000',
            overwrite: true,
            placeholderChar: '_',
            radix: '.'
        },
        props
    );
}
