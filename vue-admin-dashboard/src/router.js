import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Team from "./views/Team.vue";
import SignIn from "./views/SignInFlow/SignIn";
import Request from "./views/SignInFlow/Request";
import Recover from "./views/SignInFlow/Recover";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/team",
      name: "team",
      component: Team,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn
    },
    {
      path: "/request",
      name: "request",
      component: Request
    },
    {
      path: "/recover",
      name: "recover",
      component: Recover
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  const currentUser = window.localStorage.getItem("cur_user");
  if (requireAuth && !currentUser) {
    // next("signin");
    next({
      name: "signin",
      params: {
        userNeedLogin: true
      }
    });
  } else {
    next();
  }
});

export default router;
