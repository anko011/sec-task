import { UploadIcon } from '@radix-ui/react-icons';
import { Box, Flex, Text } from '@radix-ui/themes';
import type { ChangeEventHandler, DetailedHTMLProps, DragEventHandler, InputHTMLAttributes } from 'react';
import { useState } from 'react';

export type FileUploaderProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    onFileUpload?: (files: FileList) => void;
};

export function FileUploader({ onFileUpload, ...props }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter: DragEventHandler = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave: DragEventHandler = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver: DragEventHandler = (e) => {
        e.preventDefault();
    };

    const handleDrop: DragEventHandler = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileUpload?.(files);
        }
    };

    const handleFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = e.target.files;
        if (files == null) return;
        if (files.length > 0) {
            onFileUpload?.(files);
        }
    };

    return (
        <Flex
            align="center"
            direction="column"
            justify="center"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                backgroundColor: isDragging ? 'var(--accent-3)' : 'var(--gray-2)',
                border: `2px dashed ${isDragging ? 'var(--accent-9)' : 'var(--gray-7)'}`,
                borderRadius: 'var(--radius-3)',
                cursor: 'pointer',
                height: '200px',
                transition: 'all 0.2s ease',
                width: '100%'
            }}
        >
            <input
                id="file-input"
                multiple
                onChange={handleFileInput}
                style={{ display: 'none' }}
                type="file"
                {...props}
            />
            <label htmlFor="file-input">
                <Box
                    as="span"
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                        pointerEvents: 'none'
                    }}
                >
                    <UploadIcon height="24" width="24" />
                    <Text color="gray" size="2" style={{ cursor: 'pointer', pointerEvents: 'none' }}>
                        {isDragging ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда или нажмите для загрузки'}
                    </Text>
                </Box>
            </label>
        </Flex>
    );
}
