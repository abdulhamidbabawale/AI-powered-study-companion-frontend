import { Navigate, Outlet } from "react-router-dom";

// export default function ProtectedRoute({ roles }: { roles?: string[] }) {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   if (!user.token) return <Navigate to="/login" />;

//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return <Outlet />;
// }


export default function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}