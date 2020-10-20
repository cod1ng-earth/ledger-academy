import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useIPFS } from 'context/IPFS';
import { Button } from '@chakra-ui/core';

export default function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [folder, setFolder] = useState<any>();
  const { ipfsNode } = useIPFS();

  const updateDirectory = useCallback(async (folderName: string = '/dropzone') => {
    try {
      if (!ipfsNode) return;

      const stats = await ipfsNode.files.stat(folderName);
      setFolder(stats.cid.toString());

      const res = ipfsNode.files.ls(folderName);
      const _files = [];
      for await (const file of res) {
        _files.push(file);
      }
      console.log(_files);
      setFiles(_files);
    } catch (e) {
      console.error(e);
    }
  }, [ipfsNode]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    async function addData(fileName: string, data: ArrayBuffer | string | null): Promise<void> {
      return ipfsNode!.files.write(`/dropzone/${fileName}`, data, {
        create: true, parents: true,
      });
    }

    for await (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async () => {
        const binary = new Uint8Array(reader.result as ArrayBuffer);
        await addData(file.name, binary);
      };
      reader.readAsArrayBuffer(file);
    }
    updateDirectory();
  }, [ipfsNode, updateDirectory]);

  const {
    getRootProps, getInputProps, isDragActive,
  } = useDropzone({ onDrop });

  async function loadFile(path: string) {
    const res = ipfsNode!.files.read(path);
    for await (const r of res) {
      console.log(r);
    }
  }
  useEffect(() => {
    if (ipfsNode) {
      updateDirectory();
    }
  }, [ipfsNode, updateDirectory]);

  return (<div>
    {folder && <small>{folder}</small>}
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Drop the files here ...</p>
          : <p>Dragndrop some files here, or click to select files</p>
      }
    </div>

        <table>

      <tbody>
      {files.map((f) => <tr key={f.cid}>
        <td>
          <button onClick={() => loadFile(`/ipfs/${f.cid.toString()}`)}>{f.name}</button></td>
        <td>
          <p>{f.cid.toString()}</p>
        </td>
      </tr>)}
      </tbody>
    </table>
    <Button onClick={() => updateDirectory()} >refresh</Button>
  </div>);
}
