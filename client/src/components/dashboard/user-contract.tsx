"use client";

import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadModal } from "../modals/upload-modal";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserContract() {
  const { data: contracts } = useQuery<ContractAnalysis[]>({
    queryKey: ["user-contract"],
    queryFn: () => fetchUserContracts(),
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const contractTypeColors: { [key: string]: string } = {
    "Lao động": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "Thỏa thuận bảo mật thông tin":
      "bg-green-100 text-green-800 hover:bg-green-200",
    "Mua bán": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "Thuê nhà": "bg-red-100 text-red-800 hover:bg-red-200",
    Other: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  const columns: ColumnDef<ContractAnalysis>[] = [
    {
      accessorKey: "_id",
      header: () => {
        return <Button variant="ghost"> ID </Button>;
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("_id")}</div>
      ),
    },
    {
      accessorKey: "overallScore",
      header: () => {
        return <Button variant="ghost"> Điểm tổng hợp </Button>;
      },
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("overallScore"));
        return (
          <Badge
            className="font-bold rounded-md"
            variant={
              score > 75
                ? "success"
                : score < 50
                  ? "destructive"
                  : "secondary"
            }
          >
            {score.toFixed(2)}{" "}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contractType",
      header: "Loại hợp đồng",
      cell: ({ row }) => {
        const contractType = row.getValue("contractType") as string;
        const colorClass =
          contractTypeColors[contractType] || contractTypeColors["Other"];
        return (
          <Badge className={cn("rounded-md font-bold", colorClass)}>
            {contractType}
          </Badge>
        );
      },
    },
    {
      id:"action",
      cell: ({row}) => {
        const contract  = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/dashboard/contract/${contract._id}`}>
                  Chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <span className="text-destructive">Xóa hợp đồng</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn hoàn toàn chắc chắn?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Thao tác này không thể hoàn tác. Thao tác này sẽ xóa vĩnh
                      viễn hợp đồng của bạn khỏi máy chủ của chúng tôi.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction>Tiếp tục</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const totalContracts = contracts?.length || 0;
  const averageScore =
    totalContracts > 0 && typeof contracts !== "undefined"
      ? contracts.reduce((sum, contract) => sum + contract.overallScore, 0) /
        totalContracts
      : 0;

  const highRiskContracts =
    contracts?.filter((contract) =>
      contract.risks.some((risk) => risk.severity === "high"),
    ).length || 0;

  const tables = useReactTable({
    data: contracts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hợp đồng của bạn</h1>
        <Button onClick={() => setIsUploadModalOpen(true)}>New</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số hợp đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hợp đồng rủi ro cao
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskContracts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {tables.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.index}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {tables.getRowModel().rows.length ? (
              tables.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No result
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size={"sm"}
          onClick={() => tables.setPageIndex(0)}
          disabled={!tables.getCanPreviousPage()}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size={"sm"}
          onClick={() => tables.nextPage()}
          disabled={!tables.getCanNextPage()}
        >
          Sau
        </Button>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClosed={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => tables.reset()}
      />
    </div>
  );
}

async function fetchUserContracts(): Promise<ContractAnalysis[]> {
  const response = await api.get("/contract/user-contracts");
  return response.data;
}
