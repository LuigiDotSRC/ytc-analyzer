import azure.functions as func
import logging
import asyncio
import json
import os
from backend.youtube import get_comments
from backend.sentiment import analyze_sentiment

def main(req: func.HttpRequest) -> func.HttpResponse:
    params = req.params
    num_comments = params.get('numComments')
    if not num_comments:
        num_comments = 20
    else:
        num_comments = int(num_comments)
    if num_comments > 100:  # max_comments
        logging.error("Number of comments must be less than 100")
        return func.HttpResponse(
            "Number of comments must be less than 100",
            status_code=400
        )
    
    video_id = params.get('videoId')
    if not video_id:
        logging.error("videoId parameter is required")
        return func.HttpResponse(
            "videoId parameter is required",
            status_code=400
        )    

    try:
        comments = get_comments(video_id, num_comments)
        sentiment = asyncio.run(analyze_sentiment(comments))
        
        return func.HttpResponse(
            json.dumps({'comments': sentiment}),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        if os.getenv('ENVIRONMENT') == 'local':
            return func.HttpResponse(
                f"Error processing request: {str(e)}",
                status_code=500
            )
        
        return func.HttpResponse(
            "Internal server error", 
            status_code=500
        )
