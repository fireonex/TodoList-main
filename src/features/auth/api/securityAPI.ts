import axios from 'axios';

const socialNetworkInstance = axios.create({
     baseURL: "https://social-network.samuraijs.com/api/1.0/",
     withCredentials: true,
     headers: {
          "API-KEY": "72046884-8665-4f22-8638-ad799be78564",
     },
})


export const securityAPI = {
     getCaptchaUrl ()  {
          return socialNetworkInstance.get<{url: string}>('security/get-captcha-url')
     }
}