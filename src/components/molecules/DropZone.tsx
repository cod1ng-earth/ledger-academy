import { Box, Button } from '@chakra-ui/core';
import { useIPFS } from 'context/IPFS';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropZone({ addData, onUpdated }: {
  addData: (fileName: string, data: ArrayBuffer | string | null) => Promise<void>,
  onUpdated: () => Promise<void>
}) {
  const { ipfsNode } = useIPFS();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for await (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async () => {
        const binary = new Uint8Array(reader.result as ArrayBuffer);
        await addData(file.name, binary);
        onUpdated();
      };
      reader.readAsArrayBuffer(file);
    }
  }, [ipfsNode, addData]);

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
          ? <p>Drop the files here ...</p>
          : <p>Dragndrop some files here, or click to select files</p>
      }
    </Box>

  );
}
