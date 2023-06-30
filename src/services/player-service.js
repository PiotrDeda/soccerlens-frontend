import http from "../http-common";

const url = "/players";

class PlayerService {
    getAll() {
        return http.get(url);
    }

    get(id) {
        return http.get(`${url}/${id}`);
    }

    create(data) {
        return http.post(url, data);
    }

    update(data) {
        return http.put(url, data);
    }

    delete(id) {
        return http.delete(`${url}/${id}`);
    }
}

export default new PlayerService();
