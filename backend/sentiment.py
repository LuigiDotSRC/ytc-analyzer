import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import html
import re
from googletrans import Translator
from langdetect import detect
from typing import List
from youtube import Comment

nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()

async def text_cleanup(text: str) -> str:
    text = html.unescape(text)  # decode HTML entities
    text = re.sub(r'@\w+', '', text)  # remove @mentions

    translator = Translator()

    try:
        if detect(text) != 'en':
            translation = await translator.translate(text, dest='en')
            text = translation.text
    except Exception:
        pass 

    text = re.sub(r'[^\x00-\x7F]+', '', text)  # remove emojis
    text = re.sub(r'[^a-zA-Z,\s]', '', text)  # remove non-alpha except commas and space
    text = re.sub(r'\s+', ' ', text)  # normalize spacing 

    return text.strip()

async def analyze_sentiment(comments: List[Comment]) -> List[dict]:
    result = []
    for comment in comments:
        preprocessed_comment = await text_cleanup(comment.text)
        score = sia.polarity_scores(preprocessed_comment)

        if score['pos'] > score['neg']:
            sentiment = 'POS'
        elif score['neg'] > score['pos']:
            sentiment = 'NEG'
        else:
            sentiment = 'NEU'

        result.append({
            'id': comment.id,
            'author': comment.author,
            'text': comment.text,
            'like_count': comment.like_count,
            'published_at': comment.published_at,
            'parent_id': comment.parent_id,
            'sentiment': sentiment,
            'score': score
        })

    return result
