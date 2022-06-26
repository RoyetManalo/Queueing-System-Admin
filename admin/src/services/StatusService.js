import axios from "axios";

const url = "http://localhost:4000/api/status/";
const id = "61f40625f5ba7109dc5bff44";

class StatusService {
  static getStatus() {
    return axios.get(url);
  }

  static changeStatus(status) {
    return axios.patch(`${url}${id}`, { status });
  }
}

export default StatusService;
