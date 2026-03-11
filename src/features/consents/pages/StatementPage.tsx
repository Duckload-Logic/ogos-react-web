import { useGetStatementContent, useGetLatestStatement } from "../hooks";
import { StatementLayout } from "../components/StatementLayout";
import { StatementHeader } from "../components/StatementHeader";
import { StatementMarkdown } from "../components/StatementMarkdown";
import BackwardNavigation from "@/components/layout/BackwardNavigation";

export default function StatementPage({
  statementType,
}: {
  statementType: string;
}) {
  const { data: latestStatement, isLoading: isLatestStatementLoading } =
    useGetLatestStatement(statementType);
  const { data: statementContent, isLoading: isStatementContentLoading } =
    useGetStatementContent(statementType, latestStatement?.id);

  const isLoading = isLatestStatementLoading || isStatementContentLoading;

  return (
    <div className="flex flex-col w-full gap-4">
      <BackwardNavigation />
      <StatementLayout isLoading={isLoading}>
        {latestStatement && (
          <StatementHeader
            lastUpdatedDate={latestStatement.createdAt.split("T")[0]}
            lastUpdatedTime={
              latestStatement.createdAt.split("T")[1].split(".")[0]
            }
          />
        )}
        <StatementMarkdown content={statementContent || ""} />
      </StatementLayout>
    </div>
  );
}
