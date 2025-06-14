import { Cross1Icon, UploadIcon } from '@radix-ui/react-icons';
import { Badge, Box, Flex, IconButton, Text } from '@radix-ui/themes';
import type {
    ChangeEventHandler,
    DetailedHTMLProps,
    Dispatch,
    DragEventHandler,
    InputHTMLAttributes,
    SetStateAction
} from 'react';
import { useState } from 'react';

import type { Attachment } from '~/entities/task-packages';

export type FileUploaderProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    onFilesUpload?: Dispatch<SetStateAction<File[]>>;
    onUpdateAttachments?: Dispatch<SetStateAction<Attachment[]>>;
    files: (File | Attachment)[];
};

function getFileExt(filename: string) {
    return '.' + filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
}

export function FileUploader({
    accept,
    multiple,
    files,
    onUpdateAttachments,
    onFilesUpload,
    ...props
}: FileUploaderProps) {
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
        const fileList = e.dataTransfer.files;

        if (fileList.length > 0) {
            let files = Array.from(fileList);

            if (accept) {
                files = files.filter((f) => getFileExt(f.name) === accept);
            }

            if (!multiple) {
                const file = files[0];
                if (!file) return;
                onFilesUpload?.([file]);
                return;
            }

            onFilesUpload?.((prev) => [...prev, ...files.filter((f) => !prev.map((ef) => ef.name).includes(f.name))]);
        }
    };

    const handleFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const fileList = e.target.files;
        if (fileList == null) return;

        if (fileList.length > 0) {
            let files = Array.from(fileList);

            if (accept) {
                files = files.filter((f) => getFileExt(f.name) === accept);
            }

            if (!multiple) {
                const file = files[0];
                if (!file) return;
                onFilesUpload?.([file]);
                return;
            }

            onFilesUpload?.((prev) => [...prev, ...files.filter((f) => !prev.map((ef) => ef.name).includes(f.name))]);
        }
    };

    const onRemove = (file: File | Attachment) => () => {
        if ('id' in file) {
            onUpdateAttachments?.((prev) => prev.filter((f) => f.id !== file.id));
            return;
        }

        onFilesUpload?.((prev) => prev.filter((f) => f.name !== file.name));
    };

    return (
        <Flex direction="column" gap="2">
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
                    height: '100px',
                    transition: 'all 0.2s ease',
                    width: '100%'
                }}
                asChild
            >
                <label htmlFor="file-input">
                    <input
                        id="file-input"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                        type="file"
                        multiple={multiple}
                        accept={accept}
                        {...props}
                    />
                    <Box
                        as="span"
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)',
                            pointerEvents: 'none',
                            background: 'red,'
                        }}
                    >
                        <UploadIcon height="24" width="24" />
                        <Text color="gray" size="2" style={{ cursor: 'pointer', pointerEvents: 'none' }}>
                            {isDragging ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда или нажмите для загрузки'}
                        </Text>
                    </Box>
                </label>
            </Flex>

            <Flex gap="2" wrap="wrap">
                {Array.from(files ?? []).map((file) => {
                    const fileName = 'id' in file ? file.filename : file.name;
                    const color = 'id' in file ? 'gold' : 'blue';
                    return (
                        <Badge key={fileName} color={color}>
                            {fileName}
                            <IconButton size="1" variant="ghost" onClick={onRemove(file)} type="button">
                                <Cross1Icon />
                            </IconButton>
                        </Badge>
                    );
                })}
            </Flex>
        </Flex>
    );
}
