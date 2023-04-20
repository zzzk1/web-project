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

                <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
                          row-key = "id" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="ID" width="80"></el-table-column>
                    <el-table-column prop="name" label="菜单名" width="140"></el-table-column>
                    <el-table-column prop="path" label="路径"></el-table-column>
                    <el-table-column prop="icon" label="图标"></el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                    <el-table-column prop="pagePath" label="父项"></el-table-column>
                    <el-table-column prop="sortNum" label="排序"></el-table-column>
                    <el-table-column label="操作"  width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">新增子菜单 <i class="el-icon-plus"></i></el-button>
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

                <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%" >
                    <el-form label-width="80px" size="small">
                        <el-form-item label="菜单名">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="路径">
                            <el-input v-model="form.path" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="图标">
                            <el-input v-model="form.icon" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input v-model="form.description" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="父id">
                            <el-input v-model="form.pid" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="form.sortNum" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="save">确 定</el-button>
                    </div>
                </el-dialog>

            </el-main>

        </el-container>
    </el-container>
</template>

<script>

import request from "@/utils/request";
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "User",
    data() {
        return {
            tableData: [],
            total: 0,
            name: "",
            code: 0,
            message: "ok",

            form: {},
            dialogFormVisible: false,
            multipleSelection: [],
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            request.get("/menu", {
                params: {
                    name: this.name,
                }
            }).then(res => {
                // 注意data
                this.tableData = res.data
            })
        },
        save() {
            request.post("/menu", this.form).then(res => {
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
            request.delete("/menu/" + id).then(res => {
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
            request.post("/menu/del/batch", ids).then(res => {
                if (res.data) {
                    this.$message.success("批量删除成功")
                    this.load()
                } else {
                    this.$message.error("批量删除失败")
                }
            })
        },
        // eslint-disable-next-line no-unused-vars
        handleAdd(pid) {
            this.dialogFormVisible = true
            this.form = {}
            if (pid) {
                this.form.pid = pid;
            }
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
    }
}
</script>


<style>
.headerBg {
    background: #eee!important;
}
</style>
