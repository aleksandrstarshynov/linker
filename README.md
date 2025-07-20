# linker

I would like to tell you about my new pet project. Everything in it is more or less new to me, so I had to practice noticeably.
The idea of the project is to create software to help process and standardize disparate fragments of text from various sources. All these fragments relate to the same topic. This is very important and I will tell you why later.

The topic of the texts can be changed. In the current implementation, this is done manually, but we are still looking at Release number 1. The current project is created to support my hobby - the history of the Netherlands, in particular only the history of the city of Alkmaar.

Below is some data on the *technical implementation*. The frontend is written in pure TypeScript, a fairly simple interface. The backend is written in Python and FastAPI. Data is stored simultaneously in two databases: Superbase and Kdrant. Receiving a fragment of text from the front, the server part breaks it down using the Model into smaller fragments, which gives us a higher-quality vectorization option. Each fragment gets its own unique ID and parent ID. We put the exact fragment in the Supabase. In parallel, we embed using the Model and put it in Qdrant.

A search is performed on both bases. "Like" search and strict matching and parallel search by the closest vectors.
Thus, the technical implementation provides us with the ability to get a result even if it is written in different words or only partially reflects the information we are looking for.

A little more information about the Model. Texts are converted into vector representations using a pre-trained sentence-transformers model based on the all-MiniLM-L6-v2 architecture. The training was carried out on specialized triplets reflecting the specifics of the project. A local model is used (models/custom-embeddings-v1), which guarantees the compatibility of all embeddings and the predictability of the search in the Qdrant database.





## How to start servers
- Do not forget to install soft and dependances.
- Navigate to the Linker_client folder.
- Client server is just start *index.html with Live server*.
- Navigate to the Linker_server folder.
- Backend server rudding by  ```py -m uvicorn main:app --reload``` command in the terminal.
