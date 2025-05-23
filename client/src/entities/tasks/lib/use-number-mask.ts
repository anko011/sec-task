import { useIMask } from 'react-imask';

export function useNumberMask(props?: Parameters<typeof useIMask>[1]) {
    return useIMask(
        {
            definitions: {
                0: /\d/
            },
            lazy: false,
            mask: '000000',
            overwrite: true,
            placeholderChar: '_'
        },
        props
    );
}
