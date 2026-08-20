import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuth();
  const location = useLocation();
  const user = authData?.user;

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  const returnUrl = `${location.pathname}${location.search}`;
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`}
      replace
    />
  );
};

export default ProtectedRoute;
