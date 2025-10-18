const state = {
    isCollapse: true,
    selectMenu: [],
    routerList: [],
};

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse;
    },
    addMenu(state, payload) {
        if (
            state.selectMenu.findIndex((item) => item.path === payload.path) ===
            -1
        ) {
            state.selectMenu.push(payload);
        }
    },
    closeMenu(state, payload) {
        // 找到关闭的菜单索引
        const index = state.selectMenu.findIndex(
            (item) => item.name === payload.name
        );

        state.selectMenu.splice(index, 1);
    },
    dynamicMenu(state, payload) {
        console.log(payload, "payload");
        const modules = import.meta.glob("../views/**/**/*.vue");
        console.log(modules, "modules");

        function routerSet(router) {
            router.forEach((route) => {
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`;
                    route.component = modules[url];
                } else {
                    routerSet(route.children);
                }
            });
        }
        routerSet(payload);
        state.routerList = payload;
    },
};

export default {
    state,
    mutations,
};
