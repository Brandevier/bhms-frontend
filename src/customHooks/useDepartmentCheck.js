import { useSelector } from "react-redux";

const useDepartmentCheck = (allowedDepartmentTypes) => {
  const user = useSelector((state) => state.auth.user);
  return allowedDepartmentTypes.includes(user?.role?.name);
};

export default useDepartmentCheck;
