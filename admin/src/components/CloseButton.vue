<template>
    <div class="button">
       <button>X</button>
    </div>
    
</template>

<script>
export default {
    name:'CloseButton',
    props:{
        text: String,
        color: String
    }
}

</script>

<style scoped>
    button{
        display: block;
        background: red;
        padding: 8px 10px;
        border-radius: 10px;
        margin-bottom: 1rem;
        border: none;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
    }
</style>
