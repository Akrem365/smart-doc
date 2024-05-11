import { UnAuthenticatedError } from "../errors/index.js";

function CheckPermission(requestUser, resourceUserId) {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnAuthenticatedError("Not authorized to access this route");
}

export default CheckPermission;
