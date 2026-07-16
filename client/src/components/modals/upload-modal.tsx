"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, FileText, Loader2, Sparkles, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { setAnalysisResults } = useContractStore();

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
      formData.append("contractType", contractType);

      const response = await api.post("/contract/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      setStep("done");
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
                  Kéo và thả hợp đồng của bạn vào đây, hoặc nhấp chuột để chọn
                  tệp.
                </p>
                <p className="bg-yellow-500/30 border border-yellow-500 border-dashed text-yellow-700 p-2 rounded mt-2">
                  Lưu ý: Chỉ hỗ trợ định dạng PDF.
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
                  Phân tích hợp đồng bằng AI
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        );
      }
      case "detecting": {
        return (
          <AnimatePresence>
            <motion.div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="size-16 animate-spin text-primary" />
              <p className="mt-4 text-lg font-semibold ">
                Đang phân tích loại hợp đồng...
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
                  Chúng tôi đã phân tích được hợp đồng thuộc loại :
                  <span className="font-semibold"> {detectedType}</span>
                </p>
                <p>Bạn có muốn phân tích hợp đồng này bằng AI không?</p>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAnalyzeContract}>
                  Tôi muốn phân tích nó.
                </Button>
                <Button
                  onClick={() => setStep("upload")}
                  variant={"outline"}
                  className="flex-1"
                >
                  Không, thử lại với tệp khác.
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "processing": {
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Brain className="size-20" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-lg font-semibold text-gray-700"
              >
                AI đang phân tích hợp đồng của bạn...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-2 text-sm text-gray-700"
              >
                Việc này có thể mất một chút thời gian.
              </motion.p>
              <motion.div
                className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 10, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "done": {
        return (
          <AnimatePresence>
            <motion.div>
              <Alert className="mt-4">
                <AlertTitle>Phân tích đã hoàn tất</AlertTitle>
                <AlertDescription>
                  Hợp đồng của bạn đã được phân tích. Giờ bạn có thể xem kết
                  quả.
                </AlertDescription>
              </Alert>

              <motion.div className="mt-6 flex flex-col space-y-3 relative">
                <Button onClick={() => router.push(`/dashboard/results`)}>
                  Xem kết quả
                </Button>
                <Button variant={"outline"} onClick={handleClose}>
                  Đóng
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Upload</DialogTitle>
        <DialogDescription></DialogDescription>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
