<template>
    <PanelHead :route="route" />

    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
            >新增</el-button
        >
    </div>

    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" width="500px" />
        <el-table-column label=" 操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)"
                    >编辑</el-button
                >
            </template>
        </el-table-column>
    </el-table>

    <div class="pagination-info">
        <el-pagination
            v-model:current-page="paginationData.pageNum"
            v-model:page-size="paginationData.pageSize"
            :background="false"
            layout="prev, pager, next, jumper"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>

    <el-dialog
        v-model="dialogFormVisible"
        :before-close="beforeClose"
        title="添加权限"
        width="500"
    >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
            :rules="rules"
        >
            <el-form-item v-show="false" label="ID" prop="id">
                <el-input v-model="form.id" />
            </el-form-item>

            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称" />
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree
                    ref="treeRef"
                    style="max-width: 600px"
                    :data="permissionData"
                    node-key="id"
                    show-checkbox
                    :default-checked-keys="dafaultKeys"
                    :default-expanded-keys="[2]"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confrim(formRef)"
                    >确认</el-button
                >
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { Plus } from "@element-plus/icons-vue";
import PanelHead from "../../../components/panelHead.vue";
import {useRoute} from "vue-router";

// 挂载后请求数据
onMounted(() => {
    userGetMenu().then((res) => {
        console.log(res);
        permissionData.value = res.data.data;
    });
    getListData();
});

const route = useRoute();

// 分页列表数据
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
});

// form的数据
const form = reactive({
    id: "",
    name: "",
    permissions: "",
});

const formRef = ref();

// 树形菜单数据
const permissionData = ref([]);

// 控制弹窗的显示与隐藏
const dialogFormVisible = ref(false);

// 必选项
const dafaultKeys = [4, 5];
const treeRef = ref();

// 表单提示
const rules = reactive({
    name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
});

// 列表数据
const tableData = reactive({
    list: [],
    total: 0,
});

// ------------------------------------------------------------------------------------------

// 关闭弹窗的回调
const beforeClose = () => {
    dialogFormVisible.value = false;
    formRef.value.resetFields();
    treeRef.value.setCheckedKeys(dafaultKeys);
};

// 表单提交
const confrim = async (formEl) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid, fields) => {
        if (valid) {
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
            userSetMenu({
                name: form.name,
                permissions: permissions,
                id: form.id,
            }).then((res) => {
                console.log(res, "userSetMenu");
                if (res.data.code === 10000) {
                    beforeClose();
                    getListData();
                }
            });
        } else {
            console.log("error submit!!", fields);
            // 弹窗打开form生成是异步的
        }
    });
};

// 打开弹窗
const open = (rowData = {}) => {
    dialogFormVisible.value = true;
    if (rowData) {
        Object.assign(form, { id: rowData.id, name: rowData.name });
        treeRef.value.setCheckedKeys(rowData.permission);
    }
};

// 请求列表数据
const getListData = () => {
    menuList(paginationData).then((res) => {
        const { list, total } = res.data.data;
        tableData.list = list;
        tableData.total = total;
        console.log(res, "pageData");
    });
};

// 跳转分页
const handleSizeChange = (val) => {
    paginationData.pageSize = val;
    getListData();
};

const handleCurrentChange = (val) => {
    paginationData.pageNum = val;
    getListData();
};
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 0;
    background-color: #fff;
}
</style>
