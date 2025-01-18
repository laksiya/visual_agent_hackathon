from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain import hub
from langchain_openai import ChatOpenAI
from composio_langchain import ComposioToolSet, Action, App
import os
import dotenv
from openai import OpenAI
dotenv.load_dotenv()

class ComposioAgent:
    def __init__(self, api_key=None):
        self.llm = ChatOpenAI()
        self.prompt = hub.pull("hwchase17/openai-functions-agent")
        
        # Use provided API key or fetch from environment
        api_key = api_key or os.getenv("COMPOSIO_API_KEY")
        self.composio_toolset = ComposioToolSet(api_key=api_key)
        
        self.actions = [
            'GOOGLESHEETS_GET_SPREADSHEET_INFO',
            'GMAIL_FETCH_EMAILS', 
            'GMAIL_SEND_EMAIL', 
            'GOOGLEDOCS_CREATE_DOCUMENT',
            'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
            'GOOGLESHEETS_BATCH_UPDATE'
        ]
        
        self.tools = self.composio_toolset.get_tools(actions=self.actions)
        self.agent = create_openai_functions_agent(self.llm, self.tools, self.prompt)
        self.agent_executor = AgentExecutor(agent=self.agent, tools=self.tools, verbose=True)
    
    def execute_task(self, task):
        result = self.agent_executor.invoke({"input": task})
        return result.get("output")

# Example usage
if __name__ == "__main__":
    
    message = "2018, 38, 58, 60"
    document_name = "test"

    task = f"Save {message} in a new document called {document_name}."
    task = f"Save {message} in a new spreadsheet called {document_name}."
    # task = f"Send an email with subject {document_name} and body {message} to laksiyab@gmail.com."

    agent = ComposioAgent()
    result = agent.execute_task(task)

    print(task)
    print(result)