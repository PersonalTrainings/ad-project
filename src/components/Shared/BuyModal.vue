<template>
    <v-dialog width="400px" v-model="modal">
        <v-btn class="primary ml-2" flat slot="activator">Buy</v-btn>

        <v-card>
            <v-container>
                <v-layout row>
                    <v-flex>
                        <v-card-title>
                            <h1 class="text--primary">Do you wan't to buy it?</h1>
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row>
                    <v-flex>
                        <v-card-text>
                            <v-text-field
                                name="name"
                                label="Your name"
                                type="text"
                                v-model="name"></v-text-field>
                            <v-text-field
                                name="phone"
                                label="Your phone number"
                                type="text"
                                v-model="phone"></v-text-field>
                        </v-card-text>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                flat
                                :disabled="localLoading"
                                @click="onCancle">Close</v-btn>
                            <v-btn
                                flat
                                :disabled="localLoading"
                                class="success"
                                :loading="localLoading"
                                @click="onSave">Buy it!</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['ad'],
    data () {
        return {
            modal: false,
            name: '',
            phone: '',
            localLoading: false
        }
    },
    methods: {
        onCancle () {
            this.modal = false
        },
        onSave () {
            if (this.name !== '' && this.phone !== '') {
                this.localLoading = true
                this.$store.dispatch('createOrder', {
                    name: this.name,
                    phone: this.phone,
                    adId: this.ad.id,
                    ownerId: this.ad.ownerId
                })
                .finally(() => {
                    this.name = ''
                    this.phone = ''
                    this.localLoading = false
                    this.modal = false
                })
            }
        }
    }
}
</script>
