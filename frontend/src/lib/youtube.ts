function getVideoIdFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)

    // youtube.com/watch?v=...
    if (parsedUrl.hostname === "www.youtube.com" && parsedUrl.pathname === "/watch") {
      return parsedUrl.searchParams.get("v")
    }

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1)
    }

    return null
  } catch (error) {
    console.error("Error parsing YouTube URL:", error)
    return null
  }
}


export { getVideoIdFromUrl }