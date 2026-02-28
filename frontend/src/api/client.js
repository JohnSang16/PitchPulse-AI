import axios from "axios"

const client = axios.create({
  baseURL: "pitchpulse-ai-production.up.railway.app",
  headers: { "Content-Type": "application/json" }
})

export default client