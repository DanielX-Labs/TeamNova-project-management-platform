import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowBigUp, ArrowBigDown, Loader } from "lucide-react";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  const { title, value, isLoading } = props;

  const getArrowIcon = () => {
    if (title === "Overdue Task") {
      return value > 0 ? (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-[#EF4444]" />
      ) : (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-[#10B981]" />
      );
    }
    if (title === "Completed Task" || title === "Total Task") {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-[#10B981]" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-[#EF4444]" />
      );
    }
    return null;
  };
  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="mb-[0.2px]">{getArrowIcon()}</div>
        </div>
        <Activity
          strokeWidth={2.5}
          className="h-4 w-4 text-[#4F46E5]"
        />
      </CardHeader>
      <CardContent className="w-full">
        <div className="text-3xl font-bold">
          {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
