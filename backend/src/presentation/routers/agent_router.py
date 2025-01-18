from fastapi import APIRouter, Query
from typing import Annotated

from ..dtos import AnswerResponse
from ...domain.services.agent_service import ask_question_get_answer

agent_router = APIRouter(prefix="/agent", tags=["Agent"])

@agent_router.get("/ask_question", response_model=AnswerResponse)
async def ask_question(
    question: Annotated[str, Query()]
) -> AnswerResponse:
    answer = await ask_question_get_answer(question=question)
    return AnswerResponse(answer=answer)
