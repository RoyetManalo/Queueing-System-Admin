<template>
    <div class="currentTimeDiv">
        <span id="currentTime"><i class="far fa-clock"></i>{{this.formatNumber(currentTime.hourDisplay)}}:{{this.formatNumber(currentTime.minuteDisplay)}} Today {{currentTime.displayMonth}} {{currentTime.displayDate}}</span>
    </div>
</template>


<script>
    export default {
        name: 'CurrentTime',
        props:{
            currentTime: Object
        },
        methods:{
            formatNumber: num =>( num < 10 ? "0" + num : num) ,
     }
       
}

</script>


<style scoped>
    .currentTimeDiv {
    background: #fff;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    padding: 0 1.5rem;
    font-family: "Kiwi Maru", serif;
    /* position: absolute;
    top: 8rem;
    right: 11.3rem; */
    width: 100%;
    font-size: 1.2rem;
    color: #008789;
    padding: 0.7rem;
    
}
#currentTime{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;
}

i{
color: #008789;
}
</style>