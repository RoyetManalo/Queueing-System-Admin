import axios from "axios";

const url = "http://localhost:4000/api/queue/";
const missedQueueURL = "http://localhost:4000/api/missedqueue/";
const tokenURL = "http://localhost:4000/auth/token";

class QueueService {
  static getToken() {
    return axios.post(tokenURL);
  }
  // Get Latest Posts
  static getLatestQueue(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((queue) => ({
            queueNumber: queue.queueNumber,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static getLatestQueuePerson(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((queue) => ({
            ...queue,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // Get  Queue
  static getQueue(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((queue) => ({
            ...queue,
            createdAt: new Date(queue.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  // Get Limited Queue
  static getLimitedQueue(limit, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}_limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((queue) => ({
            ...queue,
            createdAt: new Date(queue.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // messy code
  // get missed Queue
  static getMissedQueue(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(missedQueueURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        resolve(
          data.map((queue) => ({
            ...queue,
            createdAt: new Date(queue.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // insert Multiple Queue
  static movePeopleBackInQueue(people, token) {
    return axios.post(`${url}multipleperson`, people, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Delete Multiple Missed Queue
  static deleteMultipleMissedQueue(ids, token) {
    return axios({
      method: "DELETE",
      url: `${missedQueueURL}multipleperson`,
      data: { ids: ids },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // insert missed queue
  static movePeopleInMissedQueue(missedQueuePeople) {
    return axios.post(missedQueueURL, missedQueuePeople);
  }
  // {
  //   headers: { Authorization: `Bearer ${token}` },
  // }

  // Delete Queue
  static deleteQueue(id, token) {
    return axios.delete(`${url}${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // static deleteMultipleQueue(ids, token) {
  //   return axios.delete(
  //     `${url}removemultipleperson`,
  //     { data: { ids: ids } },
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  // }

  static deleteMultipleQueue(ids, token) {
    return axios({
      method: "DELETE",
      url: `${url}multipleperson`,
      data: { ids: ids },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static deleteAllQueue(token) {
    return axios({
      method: "DELETE",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  static deleteAllMissedQueue(token) {
    return axios({
      method: "DELETE",
      url: missedQueueURL,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default QueueService;
