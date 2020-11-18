import { Box } from '@chakra-ui/core';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ArweaveWalletDropZone({ dropped }: {
  dropped: (fileName: string, data: ArrayBuffer | string | null) => Promise<void>,
}) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for await (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async () => {
        await dropped(file.name, reader.result);
      };
      reader.readAsText(file);
    }
  }, [dropped]);

  const {
    getRootProps, getInputProps, isDragActive,
  } = useDropzone({ onDrop });

  return (
        <Box bg="gray.300" border="2px" borderColor="gray.400" borderStyle="dashed"
             w="100%" p={4} color="white" {...getRootProps()}
        >
            <input {...getInputProps()} />
            {
                isDragActive
                  ? <p>Drop the wallet here ...</p>
                  : <p>Dragndrop some wallet here, or click to select files</p>
            }
        </Box>

  );
}
