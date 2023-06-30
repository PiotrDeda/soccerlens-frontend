import http from "../http-common";

const url = "/matches";

class MatchService {
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

    getEvents(id) {
        return http.get(`${url}/${id}/events`);
    }

    getComments(id) {
        return http.get(`${url}/${id}/comments`);
    }
}

export default new MatchService();
