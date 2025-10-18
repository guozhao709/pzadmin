<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon
                class="icon flex-box"
                size="20"
                @click="store.commit('collapseMenu')"
                ><Fold
            /></el-icon>
            <ul class="flex-box">
                <li
                    v-for="(item, index) in selectMenu"
                    :key="item.path"
                    class="tab flex-box"
                    :class="{ selected: route.path === item.path }"
                >
                    <el-icon size="12">
                        <component :is="item.icon" />
                    </el-icon>
                    <router-link class="text" :to="{ path: item.path }">
                        {{ item.name }}
                    </router-link>

                    <el-icon
                        class="close"
                        size="12"
                        @click="closeTag(index, item)"
                    >
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                    />
                    <p class="user-name">admin</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="cancel"
                            >退出</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
//拿到当前的路由信息
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useStore();
const selectMenu = computed(() => store.state.menu.selectMenu);

//------------------------------------------------------------------------------

const closeTag = (index, item) => {
    // 删的不是当前元素
    if (route.path !== item.path) {
        store.commit("closeMenu", item);
        return;
    }

    // 删的是当前元素
    const selectMenuData = selectMenu.value;
    // 如果tag是最后一个元素
    if (index === selectMenuData.length - 1) {
        // 如果tag只有一个元素
        if (selectMenuData.length === 1) {
            router.push("/");
        } else {
            router.push(selectMenuData[index - 1].path);
        }
        // 如果tag不是最后一个元素
    } else {
        // 如果path是第一个元素且无后继元素
        if (selectMenuData.length === 1) {
            router.push("/");
            // 如果path不是第一个元素
        } else {
            router.push(selectMenuData[index + 1].path);
        }
    }
    store.commit("closeMenu", item);
};

//
const handleClick = (command) => {
    if (command === "cancel") {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = window.location.origin;
    }
};
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left {
        height: 100%;
        .icon {
            width: 45px;
            height: 100%;
        }
        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab {
            padding: 0 10px;
            .text {
                margin: 0 5px;
            }
            .close {
                visibility: hidden;
            }
            &.selected {
                a {
                    color: #409eff;
                }
                i {
                    color: #409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover {
            background-color: #f5f5f5;
            .close {
                visibility: inherit;
                cursor: pointer;
            }
        }
    }
    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }
    a {
        // height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>
