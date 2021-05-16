import { getCookie } from "./helpers";

export default function getToken() {
  return getCookie("token");
}
