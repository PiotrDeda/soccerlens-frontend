import {createRouter, createWebHashHistory} from 'vue-router';
import UserService from "@/services/user-service";
import Home from "@/components/Home.vue";
import Register from "@/components/auth/Register.vue";
import Login from "@/components/auth/Login.vue";
import Profile from "@/components/auth/Profile.vue";
import TeamsTable from "@/components/tables/TeamsTable.vue";
import Team from "@/components/details/Team.vue";
import Player from "@/components/details/Player.vue";
import Match from "@/components/details/Match.vue";
import UsersTable from "@/components/tables/UsersTable.vue";
import MatchesTable from "@/components/tables/MatchesTable.vue";
import PlayersTable from "@/components/tables/PlayersTable.vue";

const routes = [
    {path: '/', name: "Home", component: Home},

    {path: '/register', name: "Register", component: Register},
    {path: '/login', name: "Login", component: Login},
    {path: '/profile', name: "Profile", component: Profile},
    {path: '/users', name: "Users", component: UsersTable},

    {path: '/teams', name: "Teams", component: TeamsTable},
    {path: '/teams/:id', name: "Team", component: Team},

    {path: '/players', name: "Players", component: PlayersTable},
    {path: '/players/:id', name: "Player", component: Player},

    {path: '/matches', name: "Matches", component: MatchesTable},
    {path: '/matches/:id', name: "Match", component: Match},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const restrictedPath = to.path.endsWith('/users');
    if (restrictedPath && !UserService.isAdmin())
        next('/login');
    else
        next();
});

export default router;
