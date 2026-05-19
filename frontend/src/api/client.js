import axios from "axios"

const client = axios.create({
  baseURL: "http://pitchpulse-backend-env.eba-yhtgfwu8.us-east-1.elasticbeanstalk.com/api",
  headers: { "Content-Type": "application/json" }
})

export default client