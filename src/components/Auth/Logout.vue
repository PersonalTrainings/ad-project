<template>
    <div/>
</template>

<script>
    export default {
        beforeCreate () {
            this.$store.dispatch('removeUser')
            this.$router.push('/')
        }
    }
</script>
