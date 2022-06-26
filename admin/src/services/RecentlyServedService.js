import axios from "axios";

const url = "http://localhost:4000/api/recentlyserved/";
const tokenURL = "http://localhost:4000/auth/token";

class RecentlyServedService {
  static getToken() {
    return axios.post(tokenURL);
  }
  // Get Latest Posts
  static getAllRecentlyServed(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((recentlyServed) => ({
            ...recentlyServed,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // Create Vaccine
  static insertRecentlyServed(
    _id,
    firstName,
    lastName,
    age,
    vaccineBrand,
    dose,
    date,
    token
  ) {
    return axios.post(
      url,
      {
        _id,
        firstName,
        lastName,
        age,
        vaccineBrand,
        dose,
        date,
        token,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
  // Edit Vaccine
  static editVaccine(id, vaccineBrand, vials, token) {
    return axios.post(
      url,
      { id, vaccineBrand, vials },
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

export default RecentlyServedService;
