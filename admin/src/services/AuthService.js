import axios from "axios";

const url = "http://localhost:4000/api/queue/";

class QueueService {
  // Get Latest Posts
  static getLatestQueue() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}latest`);
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

  static getLatestQueuePerson() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}latest`);
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
  static getQueue() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url);
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
  static getLimitedQueue(limit) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}_limit=${limit}`);
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

  // Create Queue
  static insertQueue(firstName, lastName, age, vaccineBrand, dose, date) {
    return axios.post(url, {
      firstName,
      lastName,
      age,
      vaccineBrand,
      dose,
      date,
    });
  }

  // Delete Queue
  static deleteQueue(id) {
    return axios.delete(`${url}${id}`);
  }

  // Delete all queue record
  static deleteAllQueue(id) {
    return axios.delete(`${url}${id}`);
  }
}

export default QueueService;
