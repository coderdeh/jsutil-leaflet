import {
    getClientWidth
} from '@/utils/index.js'
export default {
    watch: {
        clientWidth: {
            handler(val) {
                if (val >= 2560 && val < 3840) {
                    this.$store.commit('SET_SCREEN_STATE_32', false)
                    this.$store.commit('SET_SCREEN_STATE_21', true)
                } else if(val < 2560) {
                    this.$store.commit('SET_SCREEN_STATE_32', false)
                    this.$store.commit('SET_SCREEN_STATE_21', false)
                } else {
                    this.$store.commit('SET_SCREEN_STATE_32', true)
                    this.$store.commit('SET_SCREEN_STATE_21', true)
                }
                if (val >= 2880) {
                    this.isThree = true
                } else {
                    this.isThree = false
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            // is32: true,
            isThree: true,
            clientWidth: 0,
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.homeSetWidthPage(), false)
    },
    mounted() {
        this.homeSetWidthPage()
        window.addEventListener('resize', () => this.homeSetWidthPage(), false)
    },
    methods: {
        homeSetWidthPage() {
            this.setWidth()
        },
        setWidth() {
            this.clientWidth = getClientWidth()
        },
    }
}