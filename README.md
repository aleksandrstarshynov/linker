# linker

# Pitch
A descendant in routine text data processing.

The idea of the project is to create software to help process and standardize disparate fragments of text from various sources. Machine is never tied and all time stay in focus. By using this app we get ability to maintain efficiency. The machine is ready to repeat routine tasks without seeing any negative in it. The liberated person can use the freed up time resources to examine the data from a different angle and create new rules for training the model. We are not talking about saving time, we are talking about creating a sophisticated and trained partner in routine work.

Of course, processing the fragment database also leads to a reduction in the storage budget and simplification of storage security. The Edit mode actually reduces the number of such fragments.

## Peculiarities of working with text

All these fragments relate to the same topic. This is very important and I will tell you why later.

The topic of the texts can be changed. In the current implementation, this is done manually, but we are still looking at Release number 1. The current project is created to support my hobby - the history of the Netherlands, in particular only the history of the city of Alkmaar.

## Technical stack
The frontend is written in pure *TypeScript*, a fairly simple interface. The backend is written in *Python* and *FastAPI*. Data is stored simultaneously in two databases: *Superbase* and *Qdrant*. Receiving a fragment of text from the front, the server part breaks it down using the Model into smaller fragments, which gives us a higher-quality vectorization option. Each fragment gets its own unique ID and parent ID. We put the exact fragment in the Supabase. In parallel, we embed using the Model and put it in Qdrant.

A search is performed on both bases. "Like" search and strict matching and parallel search by the closest vectors.
Thus, the technical implementation provides us with the ability to get a result even if it is written in different words or only partially reflects the information we are looking for.

## Artificial Intelligence part
A little more information about the Model. Texts are converted into vector representations using a pre-trained *SentenceTransformer* model based on the *all-MiniLM-L6-v2* architecture.
The training was carried out on specialized triplets (Anchor / Positive / Negative) reflecting the specifics of the project. A local model is used (models/custom-embeddings-v1), which guarantees the compatibility of all embeddings and the predictability of the search in the Qdrant database.


## How to start servers
- Do not forget to install soft and dependances.
- Navigate to the Linker_client folder.
- Client server is just start *index.html with Live server*.
- Navigate to the Linker_server folder.
- Backend server rudding by  ```py -m uvicorn main:app --reload``` command in the terminal.
