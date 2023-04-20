<template>
    <el-container style="min-height: 100vh">

        <el-container>
            <el-main>
                <div style="margin: 10px 0">
                    <el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" v-model="name"></el-input>
                    <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
                    <el-button type="warning" @click="reset">重置</el-button>
                </div>

                <div style="margin: 10px 0">
                    <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='我再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定批量删除这些数据吗？"
                            @confirm="delBatch"
                    >
                        <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>
                    <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
                    <el-button type="primary">导出 <i class="el-icon-top"></i></el-button>
                </div>

                <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"  @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="ID" width="80"></el-table-column>
                    <el-table-column prop="name" label="用户名" width="140"></el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                    <el-table-column prop="flag" label="标识"></el-table-column>
                    <el-table-column label="操作"  width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="info" @click="selectMenu(scope.row.id)">分配菜单 <i class="el-icon-menu"></i></el-button>

                            <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                            <el-popconfirm
                                    class="ml-5"
                                    confirm-button-text='确定'
                                    cancel-button-text='我再想想'
                                    icon="el-icon-info"
                                    icon-color="red"
                                    title="您确定删除吗？"
                                    @confirm="del(scope.row.id)"
                            >
                                <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="padding: 10px 0">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNum"
                            :page-sizes="[2, 5, 10, 20]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>

                <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%" >
                    <el-form label-width="80px" size="small">
                        <el-form-item label="角色">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="标识">
                            <el-input v-model="form.description" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="标识">
                            <el-input v-model="form.flag" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="save">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%" >
                    <el-tree
                        :props="props"
                        :data="menuData"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[1, 4]"
                        :default-checked-keys="[4]"
                        @check-change="handleCheckChange">
                    </el-tree>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="menuDialogVis = false">取 消</el-button>
                        <el-button type="primary" @click="save">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>

        </el-container>
    </el-container>
</template>

<script>

import request from "@/utils/request";
// import {re} from "@babel/core/lib/vendor/import-meta-resolve";
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "User",
    data() {
        return {
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 10,
            name: "",
            code: 0,
            message: "ok",
            records: [],
            form: {},
            multipleSelection: [],
            dialogFormVisible: false,
            menuDialogVis: false,
            menuData: [],
            props: {
                label: "name",
            }
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            request.get("/role/page", {
                params: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    name: this.name,
                }
            }).then(res => {
                // 注意data
                this.tableData = res.data.records
                this.total = res.data.total
            })
        },
        save() {
            request.post("/role", this.form).then(res => {
                if (res.data) {
                    this.$message.success("保存成功")
                    this.dialogFormVisible = false
                    this.load()
                } else {
                    this.$message.error("保存失败")
                }
            })
        },
        del(id) {
            request.delete("/role/" + id).then(res => {
                if (res.data) {
                    this.$message.success("删除成功")
                    this.load()
                } else {
                    this.$message.error("删除失败")
                }
            })
        },
        delBatch() {
            let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
            request.post("/role/del/batch", ids).then(res => {
                if (res.data) {
                    this.$message.success("批量删除成功")
                    this.load()
                } else {
                    this.$message.error("批量删除失败")
                }
            })
        },
        handleAdd() {
            this.dialogFormVisible = true
            this.form = {}
        },
        handleEdit(row) {
            this.form = row
            this.dialogFormVisible = true
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        reset() {
            this.name = ""
            this.load()
        },
        handleSizeChange(pageSize) {
            console.log(pageSize)
            this.pageSize = pageSize
            this.load()
        },
        handleCurrentChange(pageNum) {
            console.log(pageNum)
            this.pageNum = pageNum
            this.load()
        },
        // eslint-disable-next-line no-unused-vars
        selectMenu(roleId) {
            this.menuDialogVis = true
            // 请求菜单数据
            request.get("/menu", {
            }).then(res => {

                this.menuData = res.data
            })
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
    }
}
</script>


<style>
.headerBg {
    background: #eee!important;
}
</style>
