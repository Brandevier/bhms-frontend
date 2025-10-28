import { useSelector } from "react-redux";

const useDepartmentCheck = (allowedDepartmentTypes) => {
  const user = useSelector((state) => state.auth.user || state.auth.admin);
  return allowedDepartmentTypes.includes(user?.role?.name);
};

export default useDepartmentCheck;
