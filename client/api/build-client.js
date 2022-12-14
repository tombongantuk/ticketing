import axios from 'axios'

const Build = ({req}) => {
    if (typeof window === 'undefined') {
        //we are on the server
        return axios.create({
            baseURL: 'http://www.ticketing-app-prod.xyz/',
            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers:req.headers
        })
    } else {
        //we must be on the browser
        return axios.create({
            baseURL:'/'
        })
    }
}

export default Build