import ContractResults from "./_components/contract-result";

interface IContractResultsProps {
  params: Promise<{ id: string }>;
}
export default async function ContractPage({params} : IContractResultsProps) {
  const { id } = await params;
  return <ContractResults key={id} contractId={id}/>;
}
