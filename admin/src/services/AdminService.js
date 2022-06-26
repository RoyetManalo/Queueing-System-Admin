import axios from "axios";

const url = "http://localhost:4000/auth/";

class AdminService {
  static compareCredentials(username, password) {
    return axios.post(`${url}login`, { username, password });
  }

  static changeAdminInfo(status) {
    return axios.patch(`${url}${id}`, { status });
  }

  static changeCredentials(username, password) {
    return axios.post(`${url}changecredentials`, { username, password });
  }
}

export default AdminService;
