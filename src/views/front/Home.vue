<template>
    <div>
        <div style="margin: 10px 0">
            <el-carousel height="450px" :interval="10000">
                <el-carousel-item v-for="item in imgs" :key="item">
                    <img :src="item" alt="" style="width: 100%">
                </el-carousel-item>
            </el-carousel>
        </div>

        <div style="margin: 10px 0">
            <el-row :gutter="10">
                <el-col :span="6" v-for="item in files" :key="item.id" style="margin-bottom: 10px">
                    <div style="border: 1px solid #ccc; padding-bottom: 10px">
                        <img :src="item.url" alt="" style="width: 100%">
                        <div style="color: #666; padding: 10px">{{ item.name }}</div>
                        <div style="padding: 10px"><el-button type="primary">购买</el-button></div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: "FrontHome",
    data() {
        return {
            imgs: [
                'http://zzzk1-mall-project.oss-cn-hongkong.aliyuncs.com/2023/04/2520245b355d2348bd991cc5b54f6b3d18Google%20%E5%B8%90%E5%8F%B7-168-VLeFuu_sWsgYyASWhO7nP8b_UPWGHcYljB-YX4QV6D7HQ%3Ds346.png'
            ],
            files: []
        }
    },
    created() {
        request.get("/echarts/file/front/all").then(res => {
            console.log(res.data)
            this.files = res.data.filter(v => v.type === 'png' || v.type === 'jpg' || v.type === 'webp')
        })
    },
    methods: {

    }
}
</script>

<style>

</style>
