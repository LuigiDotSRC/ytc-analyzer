import os
import requests
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class Comment:
    id: str
    author: str
    text: str
    like_count: int
    published_at: datetime
    parent_id: Optional[str]

def get_comments(video_id: str, num_comments: int) -> List[Comment]:
    api_key = os.getenv('GOOGLE_API_KEY')    
    if not api_key:
        raise Exception("GOOGLE_API_KEY is not set")

    url = 'https://www.googleapis.com/youtube/v3/commentThreads'
    params = {
        'key': api_key,
        'part': 'snippet',
        'videoId': video_id,
        'maxResults': num_comments,
        'order': 'relevance',
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch comments: {response.status_code} {response.text}")

    data = response.json()

    comments = []
    for item in data['items']:
        top_comment = item['snippet']['topLevelComment']['snippet']
        snippet_id = item['id']
        author = top_comment['authorDisplayName']
        text = top_comment['textDisplay']
        like_count = top_comment['likeCount']
        published_at = top_comment['publishedAt']

        comments.append(Comment(snippet_id, author, text, like_count, published_at, None))

    return comments