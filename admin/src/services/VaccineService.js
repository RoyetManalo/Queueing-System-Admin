import axios from "axios";

const url = "http://localhost:4000/api/vaccine/";
const tokenURL = "http://localhost:4000/auth/token";

class VaccineService {
  static getToken() {
    return axios.post(tokenURL);
  }
  // Get All Vaccines
  static getAllVaccine(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((vaccine) => ({
            ...vaccine,
            // i still dont get what can i put in this resolve
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // Sometimes id is undefined

  static getVaccine(id, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getLatestVaccine(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}recent`, "", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((vaccine) => ({
            ...vaccine,
            // i still dont get what can i put in this resolve
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // static getLatestVaccine(token) {
  //   return axios({
  //     method: "POST",
  //     url: `${url}recent`,
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // }

  // Create Vaccine
  static insertVaccine(vaccineBrand, vials, token) {
    return axios.post(
      url,
      { vaccineBrand, vials },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
  // Edit Vaccine
  static editVaccine(id, vials, token) {
    return axios.patch(
      `${url}${id}`,
      { vials },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  // Delete Vaccine
  static deleteVaccine(id, token) {
    return axios.delete(`${url}${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // return axios.delete(url + id)
  }
}

export default VaccineService;
