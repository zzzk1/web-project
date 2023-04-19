<template>
    <el-card style="width: 500px;">
        <el-form label-width="80px" size="small">
            <el-form-item label="用户名">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.nickname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">确定</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import request from "@/utils/request";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Person",
    data() {
        return {
            form: {},
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}

        }
    },
    created() {
        request.get("/user/username/" + this.user.token).then(res => {
            if (res.code == '200') {
                this.form = res.data
            }
        })
    },
    methods: {
        save() {
            request.post("/user", this.form).then(res => {
                if (res) {
                    this.$message.success("保存成功")
                } else {
                    this.$message.error("保存失败")
                }
            })
        },
    }

}
</script>

<style scoped>

</style>
