<template>
  <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="text--secondary mb-3">Create new ad</h1>

                <v-form class="mb-3" ref="form" v-model="valid" validation>
                    <v-text-field
                        name="title"
                        label="Ad title"
                        type="text"
                        required
                        v-model="title"
                        :rules="[v => !!v || 'Title is required']"
                    ></v-text-field>
                    <v-textarea
                        name="description"
                        label="Ad description"
                        type="text"
                        v-model="description"
                        :rules="[v => !!v || 'Description is required']"
                    ></v-textarea>
                </v-form>

                <v-layout row class="mb-3">
                    <v-flex xs12>
                    <v-btn
                        class="warning"
                        @click="triggerUpload"
                    >
                        Upload
                        <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                    <input
                        ref="fileInput"
                        type="file"
                        style="display: none;"
                        accept="image/*"
                        @change="onFileChange"/>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                    <img :src="imageSrc" height="150" v-if="imageSrc">
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                    <v-switch
                        color="primary"
                        label="Add to promo?"
                        v-model="promo"
                    ></v-switch>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-spacer></v-spacer>
                            <v-btn
                                :loading="loading"
                                :disabled="!valid || !image || loading"
                                class="success"
                                @click="createAd">
                                Create ad
                            </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },
        data () {
            return {
                valid: false,
                promo: false,
                title: '',
                description: '',
                image: null,
                imageSrc: ''
            }
        },
        methods: {
            createAd () {
                if (this.$refs.form.validate() && this.image) {
                    const newAd = {
                        title: this.title,
                        description: this.description,
                        promo: this.promo,
                        image: this.image
                    }

                    this.$store.dispatch('createAd', newAd)
                        .then(() => {
                            this.$router.push('/list')
                        })
                        .catch(() => {})
                }
            },
            triggerUpload () {
                this.$refs.fileInput.click()
            },
            onFileChange (e) {
                const file = event.target.files[0]
                const reader = new FileReader()
                reader.onload = e => {
                    this.imageSrc = reader.result
                }
                reader.readAsDataURL(file)
                this.image = file
            }
        }
  }
</script>

<style>

</style>
