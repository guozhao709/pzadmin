<template>
    <div class="panel-heading">
        <div class="panel-lead">
            <div class="title">title</div>
            <p class="description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
                esse praesentium, porro rem hic, quam sed ad laudantium
                molestiae, tempora reiciendis error. Repellendus pariatur omnis
                unde tenetur cupiditate, sunt corrupti.
            </p>
        </div>
    </div>
</template>

<script setup>
// 逻辑代码
</script>

<style scoped lang="less">
.panel-heading {
    padding: 15px;
    background: #e8edf0;
    border-color: #e8edf0;
    position: relative;
    .panel-lead {
        font-size: 14px;
        .title {
            font-weight: bold;
            font-style: normal;
        }
        .description {
            margin-top: 5px;
        }
    }
}
</style>
