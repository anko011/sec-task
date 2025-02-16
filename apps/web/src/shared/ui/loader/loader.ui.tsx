import type { FlexProps } from '@radix-ui/themes';
import { Flex, Spinner } from '@radix-ui/themes';

export type LoaderProps = FlexProps;

export function Loader(props: LoaderProps) {
    return (
        <Flex align="center" flexGrow="1" justify="center" {...props}>
            <Spinner size="3" />
        </Flex>
    );
}
