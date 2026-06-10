"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, Sparkles, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface IUploadModalProps {
  isOpen: boolean;
  onClosed: () => void;
  onUploadComplete: () => void;
}

export function UploadModal({
  isOpen,
  onClosed,
  onUploadComplete,
}: IUploadModalProps) {
  const { setAnalysisResult } = useContractStore();

  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<
    "upload" | "detecting" | "confirm" | "processing" | "done"
  >("upload");

  const { mutate: detectedContractType } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("contract", file);

      const response = await api.post<{ detectedType: string }>(
        "/contract/detect-type",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },

    onSuccess: (data: { detectedType: string }) => {
      setDetectedType(data.detectedType);
      setStep("confirm");
    },
    onError: (error) => {
      console.log(error);
      setError("Fail to detect contract type");
      setStep("done");
    },
  });

  const { mutate: uploadFile, isPending: isProcessing } = useMutation({
    mutationFn: async ({
      file,
      contractType,
    }: {
      file: File;
      contractType: string;
    }) => {
      const formData = new FormData();
      formData.append("contract", file);

      const response = await api.post("/contract/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      onUploadComplete();
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      // setFiles(acceptedFiles);
      setError(null);
      setStep("upload");
    } else {
      setError("No file selected");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleFileUpload = () => {
    if (files.length > 0) {
      setStep("detecting");
      detectedContractType({ file: files[0] });
    }
  };

  const handleAnalyzeContract = () => {
    if (files.length > 0 && detectedType) {
      setStep("processing");
      uploadFile({ file: files[0], contractType: detectedType });
    }
  };

  const handleClose = () => {
    onClosed();
    setFiles([]);
    setDetectedType(null);
    setError(null);
    setStep("upload");
  };

  const renderContent = () => {
    switch (step) {
      case "upload": {
        return (
          <AnimatePresence>
            <motion.div className="">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 mt-8 mb-4 text-center transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:border-gray-400",
                )}
              >
                <input {...getInputProps()} />
                <motion.div>
                  <FileText className="mx-auto size-16 text-primary" />
                </motion.div>
                <p className="mt-4 text-sm text-gray-600">
                  Drag &apos;n&apos; drop your contract here, or click to select
                  files
                </p>
                <p className="bg-yellow-500/30 border border-yellow-500 border-dashed text-yellow-700 p-2 rounded mt-2">
                  Note: Only PDF files are supported
                </p>
              </div>
              {files.length > 0 && (
                <div className="mt-4 bg-green-500/30 border border-green-500 border-dashed text-green-700 p-2 rounded flex items-center justify-between">
                  <span>
                    {files[0].name}
                    {""}
                    <span className="text-sm text-gray-600">
                      ({files[0].size} bytes)
                    </span>
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="hover:bg-green-500"
                  >
                    <Trash className="size-5 hover:text-green-500" />
                  </Button>
                </div>
              )}
              {files.length > 0 && !isProcessing && (
                <Button className="mt-4 w-full mb-4" onClick={handleFileUpload}>
                  <Sparkles className="mr-2 size-4" />
                  Analyze Contract With AI
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        );
      }
      case "detecting": {
        return (
          <AnimatePresence>
            <motion.div>
              <Loader2 className="size-16 animate-spin text-primary" />
              <p className="mt-4 text-lg font-semibold ">
                Detecting contract type...
              </p>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "confirm": {
        return (
          <AnimatePresence>
            <motion.div>
              <div className="flex flex-col space-y-4 mb-4">
                <p>
                  We have detected the following contract type:
                  <span className="font-semibold"> {detectedType}</span>
                </p>
                <p>Would you like to analyze this contract with our AI?</p>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAnalyzeContract}>
                  Yes, I want to analyze it
                </Button>
                <Button
                  onClick={() => setStep("upload")}
                  variant={"outline"}
                  className="flex-1"
                >
                  No, Try another file
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "processing": {
        
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Upload file</DialogTitle>
        <DialogDescription></DialogDescription>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
