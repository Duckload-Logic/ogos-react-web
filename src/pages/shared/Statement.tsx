import { useGetStatementContent, useGetLatestStatement } from "@/features/consents/hooks";
import { StatementLayout } from "@/features/consents/components/StatementLayout";
import { StatementHeader } from "@/features/consents/components/StatementHeader";
import { StatementMarkdown } from "@/features/consents/components/StatementMarkdown";
import BackNav from "@/components/layout/BackNav";

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
    <div className="flex w-full flex-col gap-4">
      <BackNav />
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
