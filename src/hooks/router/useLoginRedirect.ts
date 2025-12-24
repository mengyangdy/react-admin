import { useLocation, useNavigate } from "@tanstack/react-router";

export function useLoginRedirect() {
  const navigate = useNavigate();

  const location = useLocation();
  const redirectToLogin = () => {
    navigate({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  };
  return redirectToLogin;
}
