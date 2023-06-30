import http from "../http-common";

const url = "/teams";

class TeamService {
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

    getPlayers(id) {
        return http.get(`${url}/${id}/players`);
    }

    getMatches(id) {
        return http.get(`${url}/${id}/matches`);
    }
}

export default new TeamService();
