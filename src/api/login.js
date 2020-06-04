import axios from '@/utils/request.js'
export function getSms(data) {
    return axios({
        method: 'post',
        url: '/getSms/',
        data
    })
}
export function register(data) {
    return axios({
        method: 'post',
        url: '/register/',
        data
    })
}
export function login(data) {
    return axios({
        method: 'post',
        url: "/login/",
        data
    })
}