<template>
    <el-row class="login-container" justify="center" :align="'middle'">
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="" />
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{
                    formType === false ? "注册账号" : "返回登录"
                }}</el-link>
            </div>
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                style="max-width: 600px"
                class="demo-ruleForm"
                :rules="rules"
            >
                <el-form-item prop="userName">
                    <el-input
                        v-model="loginForm.userName"
                        placeholder="手机号"
                        prefix-icon="UserFilled"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input
                        type="password"
                        v-model="loginForm.passWord"
                        placeholder="密码"
                        prefix-icon="Lock"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="validCode" v-if="formType">
                    <el-input
                        v-model="loginForm.validCode"
                        placeholder="验证码"
                        prefix-icon="Lock"
                    >
                        <template #append>
                            <span @click="countDownChange">
                                {{ countDown.validText }}
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :style="{ width: '100%' }"
                        @click="submitForm(loginFormRef)"
                    >
                        {{ formType ? "注册" : "登录" }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script setup>
import { ref, reactive, computed, toRaw } from "vue";
import { getCode, userAuthentication, login, menuPermissions } from "../../api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'

const router = useRouter();
const store = useStore()

// 引入静态图片资源
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;
// false: 登录 true: 注册
const formType = ref(false);

// 手机号正则
const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;

const loginForm = reactive({
    userName: "",
    passWord: "",
    validCode: "",
});

const routerList = computed(()=>{
    return store.state.menu.routerList
})

// 注册登录页面切换
const handleChange = () => {
    formType.value = !formType.value;
};

// 账号(手机号)校验规则
const validateUser = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入手机号"));
    } else {
        phoneReg.test(value)
            ? callback()
            : callback(new Error("手机号格式不对, 请输入正确的手机号"));
    }
};

// 密码校验
const validatePass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入密码"));
    } else {
        const reg = /^[a-zA-Z0-9_-]{4,16}$/;
        reg.test(value)
            ? callback()
            : callback(new Error("密码格式不对, 请输入4-16位字母数字下划线"));
    }
};

// 表单验证
const rules = reactive({
    userName: [
        {
            validator: validateUser,
            trigger: "blur",
        },
    ],
    passWord: [
        {
            validator: validatePass,
            trigger: "blur",
        },
    ],
});

// 验证码倒计时
const countDown = reactive({
    time: 60,
    validText: "获取验证码",
});

let flag = false;
const countDownChange = () => {
    if (flag) {
        return;
    }

    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage({
            message: "请输入正确的手机号",
            type: "error",
        });
    }

    let id = setInterval(() => {
        if (countDown.time === 0) {
            countDown.time = 60;
            countDown.validText = "获取验证码";
            flag = false;
            clearInterval(id);
        } else {
            countDown.time -= 1;
            countDown.validText = countDown.time + "秒后重试";
        }
    }, 1000);
    flag = true;

    getCode({ tel: loginForm.userName });
};

const loginFormRef = ref();

// 表单提交
const submitForm = async (formEL) => {
    if (!formEL) {
        return;
    }

    await formEL.validate((valid, fields) => {
        if (valid) {
            // 注册页面
            if (formType.value) {
                userAuthentication(loginForm).then((data) => {
                    console.log(data);
                    if (data.data.code === 10000) {
                        formType.value = false;
                    }
                });
            } else {
                // 登录页面
                login(loginForm).then((data) => {
                    console.log(data);
                    localStorage.setItem("token", data.data.data.token);
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify(data.data.data.userInfo)
                    );
                    menuPermissions().then(({data}) => {
                        console.log(data, 'data')
                        store.commit('dynamicMenu', data.data)
                        console.log(routerList.value, 'routerList')
                        toRaw(routerList.value).forEach(item=>{
                            router.addRoute('main', item);
                        })
                        router.push('/');
                    })
                });
            }
        } else {
            console.log("error submit", fields);
        }
    });
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0;
}
.login-container {
    height: 100%;
    .card-header {
        background-color: #899fe1;
        img {
            width: 430px;
        }
    }
    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>
