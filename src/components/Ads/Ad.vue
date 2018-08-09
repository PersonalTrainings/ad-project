<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card v-if="!loading">
            <v-card-media
                :src="ad.imageSrc"
                height="300px"
            ></v-card-media>
            <v-card-text>
                <h1 class="text--primary">{{ad.title}}</h1>
                <p>{{ad.description}}</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <app-edit-ad-modal :ad="ad" v-if="isOwner"></app-edit-ad-modal>
                <app-buy-modal :ad="ad"></app-buy-modal>
            </v-card-actions>
        </v-card>
        <div v-else class="text-xs-center">
            <v-progress-circular
                :size="100"
                :width="4"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import EditAdModal from './EditAdModal'

    export default {
        props: ['id'],
        computed: {
            ad () {
                const id = this.id
                const result = this.$store.getters.adById(id)
                if (!result) {
                    return this.$router.push('/')
                }
                return result
            },
            loading () {
                return this.$store.getters.loading
            },
            isOwner () {
                const { user } = this.$store.getters
                return this.ad.ownerId === (user && user.id)
            }
        },
        components: {
            appEditAdModal: EditAdModal
        }
    }
</script>

<style scoped>

</style>
