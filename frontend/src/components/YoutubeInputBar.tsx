import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getVideoIdFromUrl } from "@/lib/youtube"

function YoutubeInputBar() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = getVideoIdFromUrl(url)
    if (!videoId) {
      setError("Please enter a valid YouTube watch link with a video ID.")
      return
    }
    setError("")
    alert(`Submitted: ${url}`)
    console.log(videoId)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xl mx-auto gap-2">
      <div className="flex gap-2">
        <Input type="url" placeholder="Paste YouTube video link here..." value={url} onChange={e => setUrl(e.target.value)} required className="flex-1" />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Submit</Button>
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </form>
  )
}

export default YoutubeInputBar