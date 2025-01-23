import os

#from langchain_community.document_loaders import WebBaseLoader¨
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from infrastructure.composio_agent import ComposioAgent

load_dotenv()
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-3.5-turbo", temperature=0)

lovdata_template = """
<question>
{question}
</question>

<relevant-information>
{lovdata}
</relevant-information>

<instructions>
1. Go through the question in <question>, to understand it.
2. Go through the relevant information found in <relevant-information>
3. Answer the question in <question>, by using the relevant information in <relevant-information>.
4. Output the most relevant task in <task> based on the question <question>. Only valid values here are 'mail', 'document' or 'spreadsheet'.
5. Add a fitting document name in <document-name>.
6. Output the answer in <message> based on the question <question>.
</instructions>

Format the answer as follows:
<answer>
    <task>
        Categorize the task here, and output only one of these tasks: 'mail', 'document' or 'spreadsheet'.
    </task>
    <document-name>
        Add a fitting document name for either the document, spreadsheet or email.
    </document-name>
    <message>
        Add the answer to the question here, based on the relevant 
        information in <relevant-information>.
    </message>
</answer>
"""

skatt_lovdata = """
Skatteloven er en norsk lov som regulerer forhold ved innkreving av ulike skatter. Blant annet regulerer loven formuesskatt, inntektsskatt, grunnrenteskatt, naturresursskatt og tonnasjeskatt.

I tråd med legalitetsprinsippet er loven hjemmelsgrunnlag for kommunestyrene, fylkestingene og Stortinget slik at disse kan pålegge de fastsatte skattene ved de ulike administrasjonsnivåene.

Någjeldende skattelov ble vedtatt i 1999 som følge av et behov for lovteknisk revisjon av gjeldende skattelov fra 1911 og de ulike særlovene som var i kraft i 1999. Skattereformer er jevnlig gjenstand for politisk debatt i anledning valg og andre former for utøvelse av demokrati.
"""

prompt = PromptTemplate.from_template(lovdata_template)

def extract_content_between_tags(
    text: str, opening_tag: str, closing_tag: str
) -> str:
    """
    Extracts the content between the specified opening and closing tags in a given text.

    Args:
        text (str): The text from which to extract content.
        opening_tag (str): The opening tag, including any attributes. Example: '<div>'.
        closing_tag (str): The closing tag. Example: '</div>'.

    Returns:
        str: The extracted content between the opening and closing tags, or an empty string
             if the tags are not found or are improperly ordered.

    Examples:
        >>> text = "<div>Hello World</div>"
        >>> extract_content_between_tags(text, "<div>", "</div>")
        'Hello World'

        >>> text = "<p>Paragraph content</p>"
        >>> extract_content_between_tags(text, "<p>", "</p>")
        'Paragraph content'

        >>> text = "<div><span>Nested content</span></div>"
        >>> extract_content_between_tags(text, "<span>", "</span>")
        'Nested content'

        >>> text = "<note>Important</note>"
        >>> extract_content_between_tags(text, "<note>", "</note>")
        'Important'

        >>> text = "<section><header>Header Content</header></section>"
        >>> extract_content_between_tags(text, "<header>", "</header>")
        'Header Content'

        >>> text = "<message>Message Content</message>"
        >>> extract_content_between_tags(text, "<message>", "</message>")
        'Message Content'

        >>> text = "<tag>   Whitespace Content   </tag>"
        >>> extract_content_between_tags(text, "<tag>", "</tag>")
        'Whitespace Content'

        >>> text = "<div>Hello World</div>"
        >>> extract_content_between_tags(text, "<p>", "</p>")
        ''

        >>> text = "No tags here"
        >>> extract_content_between_tags(text, "<div>", "</div>")
        ''
    """
    # Finding the index immediately after the opening tag
    start_index = text.find(opening_tag)
    if start_index == -1:
        return ""  # Return an empty string if opening tag is not found
    start_index += len(opening_tag)  # Move index to the end of the opening tag

    # Finding the start index of the closing tag
    end_index = text.find(closing_tag, start_index)
    if end_index == -1:
        return ""  # Return an empty string if closing tag is not found after the opening tag

    # Extracting the content between the opening and closing tags
    return text[start_index:end_index].strip()

async def ask_question_get_answer(question: str) -> dict:
    llm_chain = prompt | llm
    answer = llm_chain.invoke(input={"question": question, "lovdata": skatt_lovdata})
    task_type = extract_content_between_tags(str(answer), opening_tag="<task>", closing_tag="</task>").strip()
    document_name = extract_content_between_tags(str(answer), opening_tag="<document-name>", closing_tag="</document-name>")
    message = extract_content_between_tags(str(answer), opening_tag="<message>", closing_tag="</message>")
    print(task_type)
    agent = ComposioAgent()

    if "document" in task_type:
        task = f"Save {message} in a new document called {document_name}."
        print(task)
        result = agent.execute_task(task)
        print(result)
        return {
            "task": task_type,
            "document_name": document_name,
            "message": message,
            "result": result
        }

    elif "spreadsheet" in task_type:
        task = f"Save {message} in a new spreadsheet called {document_name}."
        print(task)
        result = agent.execute_task(task)
        print(result)
        return {
            "task": task_type,
            "document_name": document_name,
            "message": message,
            "result": result
        }

    elif "mail" in task_type:
        task = f"Send an email with subject {document_name} and body {message} to laksiyab@gmail.com."
        print(task)
        result = agent.execute_task(task)
        print(result)

        return {
            "task": task_type,
            "document_name": document_name,
            "message": message,
            "result": result
        }
    
    else:   
        return {
            "task": task_type,
            "document_name": document_name,
            "message": message,
            "result": "No task found"
        }