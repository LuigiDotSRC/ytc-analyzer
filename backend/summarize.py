from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document
from typing import List
from youtube import Comment
import os

async def openai_summarize(comments: List[Comment]) -> str:
    if not os.getenv('OPENAI_API_KEY'):
        raise Exception("OPENAI_API_KEY is not set")

    docs = [Document(page_content=comment.text) for comment in comments]

    prompt = ChatPromptTemplate.from_messages([
        ('system', 'Write a summary of the following youtube comments. Highlight the most important points and the most relevant information while maintaining the original meaning and tone.'),
        ('user', '{context}')
    ])

    llm = ChatOpenAI(model='gpt-4', temperature=0.5)
    chain = create_stuff_documents_chain(llm, prompt)

    return await chain.invoke({'context': docs})
