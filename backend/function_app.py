import azure.functions as func
import logging
import asyncio
import json
import os
from youtube import get_comments
from sentiment import analyze_sentiment
from summarize import openai_summarize

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

max_comments = 100

@app.route(route="sentiment")
def sentiment(req: func.HttpRequest) -> func.HttpResponse:
    params = req.params
    num_comments = params.get('numComments')
    if not num_comments:
        num_comments = 20
    else:
        num_comments = int(num_comments)
    if num_comments > max_comments:
        logging.error(f"Number of comments must be less than {max_comments}")
        return func.HttpResponse(
            f"Number of comments must be less than {max_comments}",
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

@app.route(route="summary")
def summary(req: func.HttpRequest) -> func.HttpResponse:
    params = req.params
    num_comments = params.get('numComments')
    if not num_comments:
        num_comments = 20
    else:
        num_comments = int(num_comments)
    if num_comments > max_comments:
        logging.error(f"Number of comments must be less than {max_comments}")
        return func.HttpResponse(
            f"Number of comments must be less than {max_comments}",
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
        summary = openai_summarize(comments)
        
        return func.HttpResponse(
            json.dumps({'summary': summary}),
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

