<template>
    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
                    scope.row.active ? "正常" : "失效"
                }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 10px">{{
                        scope.row.create_time
                    }}</span>
                </div>
            </template>
        </el-table-column>
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
        v-model="dialogFormVisable"
        :before-close="beforeClose"
        title="添加权限"
        width="500"
    >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
        >
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled />
            </el-form-item>

            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>

            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select
                    v-model="form.permissions_id"
                    placeholder="请选择菜单权限"
                    style="width: 240px"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
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
import { authAdmin, menuSelectList, updataUser } from "../../../api";
import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
});

// list数据
const tableData = reactive({
    list: [],
    total: 0,
});

// 权限选项
const options = ref([]);

// 控制弹窗
const dialogFormVisable = ref(false);

// 编辑表单
const form = reactive({
    name: "",
    permissions_id: 0,
    mobile: "",
});

// 表单实例
const formRef = ref();

//--------------------------------------------------------------------

const beforeClose = () => {
    dialogFormVisable.value = false;
};

onMounted(() => {
    getListData();
    menuSelectList().then((res) => {
        options.value = res.data.data;
        console.log(options.value, "optionsValue");
    });
});

// 根据权限id匹配权限名称
const permissionName = (permissions_id) => {
    const data = options.value.find((el) => el.id === permissions_id);
    return data ? data.name : "超级管理员";
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

// 打开弹窗
const open = (rowData = {}) => {
    dialogFormVisable.value = true;
    if (rowData) {
        Object.assign(form, {
            id: rowData.id,
            name: rowData.name,
            mobile: rowData.mobile,
            prmissions_id: rowData.permissions_id,
        });
    }
};

// 请求列表数据
const getListData = () => {
    authAdmin(paginationData).then((res) => {
        console.log(res, "pagData");
        const { list, total } = res.data.data;
        list.forEach((item) => {
            item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
        });
        tableData.list = list;
        tableData.total = total;
    });
};

//表单提交
const confrim = async (formEL) => {
    if (!formEL) {
        return;
    }

    await formEL.validate((valid, fields) => {
        if (valid) {
            const { name, permissions_id } = form;
            console.log(name, permissions_id, "pr_id");
            updataUser({ name, permissions_id }).then((res) => {
                console.log(res, "上交的表单数据");
                if (res.data.code === 10000) {
                    getListData();
                    beforeClose();
                }
            });
        } else {
            console.log(fields, "error");
        }
    });
};
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
}
</style>
