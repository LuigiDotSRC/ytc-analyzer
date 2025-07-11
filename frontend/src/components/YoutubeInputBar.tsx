import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getVideoIdFromUrl } from "@/lib/youtube"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axiosInstance from "@/lib/axios"

function YoutubeInputBar({ onAnalysisComplete }: { onAnalysisComplete: (analysis: { summary: any, sentiment: any }) => void }) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = getVideoIdFromUrl(url)
    if (!videoId) {
      setError("Please enter a valid YouTube watch link with a video ID.")
      return
    }
    setError("")
    setIsLoading(true)

    try {
      const [summaryResponse, sentimentResponse] = await Promise.all([
        axiosInstance.get(`/summary?videoId=${videoId}`),
        axiosInstance.get(`/sentiment?videoId=${videoId}`)
      ])
      const summaryData = summaryResponse.data
      const sentimentData = sentimentResponse.data

      const analysis = {
        summary: summaryData,
        sentiment: sentimentData
      }

      onAnalysisComplete(analysis)
    } catch (err) {
      setError("Failed to analyze video. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xl mx-auto gap-2">
      <div className="flex gap-2">
        <Input placeholder="Paste YouTube video link here..." value={url} onChange={e => setUrl(e.target.value)} required className="flex-1" disabled={isLoading} />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Submit"}
        </Button>
        <Button
          type="button"
          aria-label="Clear input"
          onClick={() => setUrl("")}
          className="bg-gray-100 hover:bg-red-100 border border-gray-300 text-gray-500 hover:text-red-600 transition-colors"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      {isLoading && (
        <Alert>
          <AlertTitle>Analyzing Video</AlertTitle>
          <AlertDescription>Please wait while we analyze the YouTube video...</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}

export default YoutubeInputBar