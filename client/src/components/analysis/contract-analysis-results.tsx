import { ContractAnalysis } from "@/interfaces/contract.interface";
import { useState } from "react";

interface IContractAnalysisResultsProps {
    analysisResults: ContractAnalysis;
    contractId: string;
}

export default function ContractAnalysisResults({}: IContractAnalysisResultsProps) {
    const [activeTab, setActiveTab] = useState("summary");

    return (
        <div className="container mx-auto px-4 py-8">

        </div>
    )
}