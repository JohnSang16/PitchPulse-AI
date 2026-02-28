import axios from "axios"

const client = axios.create({
  baseURL: "https://pitchpulse-ai-production.up.railway.app/api",
  headers: { "Content-Type": "application/json" }
})

export default client