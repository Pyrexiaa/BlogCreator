from jamaibase import JamAI
from jamaibase import protocol as p

def create_tables(jamai: JamAI):
    # Create an Action Table
    table = jamai.create_action_table(
        p.ActionTableSchemaCreate(
            id="action-simple",
            cols=[
                p.ColumnSchemaCreate(id="length", dtype=p.DtypeCreateEnum.int_),
                p.ColumnSchemaCreate(id="text", dtype=p.DtypeCreateEnum.str_),
                p.ColumnSchemaCreate(
                    id="summary",
                    dtype=p.DtypeCreateEnum.str_,
                    gen_config=p.ChatRequest(
                        model="openai/gpt-4o",
                        messages=[
                            p.ChatEntry.system("You are a concise assistant."),
                            # Interpolate string and non-string input columns
                            p.ChatEntry.user("Summarise this in ${length} words:\n\n${text}"),
                        ],
                        temperature=0.001,
                        top_p=0.001,
                        max_tokens=100,
                    ).model_dump(),
                ),
            ],
        )
    )
    print(table)

    # Create a Knowledge Table
    table = jamai.create_knowledge_table(
        p.KnowledgeTableSchemaCreate(
            id="knowledge-simple",
            cols=[],
            embedding_model="ellm/BAAI/bge-m3",
        )
    )
    print(table)

    # Create a Chat Table
    table = jamai.create_chat_table(
        p.ChatTableSchemaCreate(
            id="chat-simple",
            cols=[
                p.ColumnSchemaCreate(id="User", dtype=p.DtypeCreateEnum.str_),
                p.ColumnSchemaCreate(
                    id="AI",
                    dtype=p.DtypeCreateEnum.str_,
                    gen_config=p.ChatRequest(
                        model="openai/gpt-4o",
                        messages=[p.ChatEntry.system("You are a pirate.")],
                        temperature=0.001,
                        top_p=0.001,
                        max_tokens=100,
                    ).model_dump(),
                ),
            ],
        )
    )
    print(table)