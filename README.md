# EmailPro
AI based email application to make accessing and using email services easy

## Key Technical Aspects
1. RAG pipline with custom chatbot
2. Full text search
3. Full email client clone (Syncing email, sending & receiving. composing etc)
4. AI smart compose (Email writing copilot)
5. Command K command bar
6. Stripe payment setup (SaaS Subscription service)

## Key Technical Aspects
1. Understand email client functionality with Aurinko
2. Set up NextJS, ShadCN, Clerk and Database
3. Prepare Aurinko API to receive and sync emails
4. Also do database engineering & webhook management
5. Hook up full text search with Orama
6. Hook up initial UI to display emails & threads
7. Search UI
8. Rag pipeline QnA with Vercel AI SDK
9. Replies and Composing with Copilot
10. String setup
11. Deploy to Vercel
12. Landing page

# Orama 
https://github.com/oramasearch/orama
Provide full text search + chat funcitonalities for project.

# Aurinko
```https://docs.aurinko.io/```
- Used to sync, integrate email, calendar, contacts, tasks painlessly in the project with the help of a centralized API.
- The Aurinko unified mailbox API allows developers to quickly build integrations with many mailbox providers and services like Google, Office 365, Outlook.com, MS Exchange.

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
