import http from "../http-common";

const url = "/match-events";

class MatchEventService {
    eventTypes() {
        return [
            {value: "GOAL", label: "Goal"},
            {value: "OWN_GOAL", label: "Own Goal"},
            {value: "YELLOW_CARD", label: "Yellow Card"},
            {value: "RED_CARD", label: "Red Card"},
            {value: "SUBSTITUTION", label: "Substitution"},
            {value: "OTHER", label: "Other"},
        ];
    }

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

    convertEventTypeName(eventType) {
        return this.eventTypes().find((e) => e.value === eventType).label;
    }
}

export default new MatchEventService();
