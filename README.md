# EmailPro
AI based email application to make accessing and using email services easy

# Orama 
https://github.com/oramasearch/orama
Provide full text search + chat funcitonalities for project.

# Aurinko
https://docs.aurinko.io/
To integrate email, calendar, contacts, tasks painlessly in the project.
The Aurinko unified mailbox API allows developers to quickly build integrations with many mailbox providers and services like Google, Office 365, Outlook.com, MS Exchange.

# Flow of connection:
- Step 1: Grant access to aurinko
- Step 2: aurinko sends us back a authorization token - alongside the user's email info  /api/aurinko/callback
- Step 3: save it to database
id. accountId. auth-token.  address.
- Step 4: Use the auth-token to sync their inbox
api.aurinko.com/email/sync with accountId and token detials
this will returns us the all email

# RAG Pipeline
Retrieval-Augmented Generation (RAG) Pipeline will access the database of documents and the search bot will search through all the relevant documents and put the context in chat bot for interaciton.

# Full Email Client Clone
Same like all other email application

# AI smart compose
AI driven emails and composing email efficently through AI.

# Comman K controls


# Stripe Payment Integration for Saas Subscription Service
