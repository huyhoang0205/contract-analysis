# Contract Analysis

AI-powered contract review for Vietnamese legal documents. Upload a PDF, confirm the detected contract type, and get a structured analysis of risks, opportunities, and negotiation points. The app runs as a monorepo: a [Next.js](https://nextjs.org) frontend in [`client/`](client/) and an [Express](https://expressjs.com) API in [`server/`](server/).

## Techniques Used

- **Next.js App Router with route groups** — Private pages live under [`client/src/app/(private)/`](<client/src/app/(private)/>). The `(private)` folder groups routes without changing the URL. [Next.js routing docs](https://nextjs.org/docs/app/building-your-application/routing)

- **Session-based auth with Passport.js** — Google OAuth runs through [Passport](http://www.passportjs.org/) in [`server/src/config/passport.ts`](server/src/config/passport.ts). Sessions use [express-session](https://github.com/expressjs/session) with a [MongoDB store](https://www.npmjs.com/package/connect-mongo). The client sends cookies via Axios `withCredentials` in [`client/src/lib/api.ts`](client/src/lib/api.ts).

- **Multipart file upload with Multer** — PDFs upload through [Multer](https://github.com/expressjs/multer) memory storage in [`server/src/controller/contract.controller.ts`](server/src/controller/contract.controller.ts). The client sends files with [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and the [`multipart/form-data`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types) content type.

- **Temporary file caching in Redis** — Uploaded PDF buffers sit in [Upstash Redis](https://upstash.com/docs/redis) with a one-hour TTL before text extraction. Contract lookups are cached the same way in [`server/src/controller/contract.controller.ts`](server/src/controller/contract.controller.ts).

- **PDF text extraction in Node** — [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) reads PDF pages and pulls text content in [`server/src/services/ai.service.ts`](server/src/services/ai.service.ts).

- **Structured AI output with JSON fallback parsing** — The AI returns JSON for risks, opportunities, and scores. If parsing fails, regex-based extraction in [`server/src/services/ai.service.ts`](server/src/services/ai.service.ts) pulls partial results instead of failing completely.

- **Stripe webhook raw body handling** — The webhook route in [`server/src/app.ts`](server/src/app.ts) uses [`express.raw()`](https://expressjs.com/en/4x/api.html#express.raw) so [Stripe signature verification](https://docs.stripe.com/webhooks/signatures) works on the raw request body.

- **Freemium content gating** — Free users see three risks/opportunities plus blurred placeholder items. Premium sections use a [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) overlay in [`client/src/components/analysis/contract-analysis-results.tsx`](client/src/components/analysis/contract-analysis-results.tsx).

- **Server state with TanStack Query** — Auth and API calls use [`useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) and [`useMutation`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) in hooks like [`client/src/hooks/useCurrentUser.ts`](client/src/hooks/useCurrentUser.ts).

- **Client state with Zustand** — Modal visibility and analysis results use lightweight stores in [`client/src/store/zustand.ts`](client/src/store/zustand.ts).

- **Drag-and-drop uploads** — [react-dropzone](https://react-dropzone.js.org/) handles PDF selection in the upload modal.

- **Step-based upload flow with Framer Motion** — The upload modal moves through upload → detect → confirm → process → done states with [Framer Motion](https://www.framer.com/motion/) transitions.

- **OKLCH design tokens in Tailwind CSS v4** — Theme colors in [`client/src/app/globals.css`](client/src/app/globals.css) use the [OKLCH color space](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) via Tailwind v4 `@theme inline`.

- **Local font loading with next/font** — [Geist](https://vercel.com/font) Sans and Mono load as variable fonts through [`next/font/local`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) in [`client/src/app/layout.tsx`](client/src/app/layout.tsx).

## Notable Libraries and Services

| Library / Service                                                                        | Role                                                                                                                   |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [Next.js 16](https://nextjs.org)                                                         | React framework with App Router                                                                                        |
| [Express 5](https://expressjs.com)                                                       | REST API server                                                                                                        |
| [Mongoose](https://mongoosejs.com)                                                       | MongoDB ODM for users and contract analyses                                                                            |
| [Upstash Redis](https://upstash.com/docs/redis)                                          | Serverless Redis for file buffers and response caching                                                                 |
| [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist)                                   | PDF text extraction on the server                                                                                      |
| [OpenAI SDK](https://platform.openai.com/docs/api-reference)                             | AI client pointed at a custom API endpoint in [`server/src/services/ai.service.ts`](server/src/services/ai.service.ts) |
| [Passport Google OAuth 2.0](http://www.passportjs.org/packages/passport-google-oauth20/) | Google sign-in                                                                                                         |
| [Stripe](https://stripe.com/docs)                                                        | Card payments and webhook-based premium activation                                                                     |
| [VNPay SDK](https://www.npmjs.com/package/vnpay)                                         | Vietnam local payment gateway                                                                                          |
| [Resend](https://resend.com/docs)                                                        | Transactional email after premium purchase                                                                             |
| [TanStack Query](https://tanstack.com/query)                                             | Async server state on the client                                                                                       |
| [Zustand](https://zustand.docs.pmnd.rs/)                                                 | Lightweight client state                                                                                               |
| [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)                | Accessible UI components                                                                                               |
| [Recharts](https://recharts.org)                                                         | Pie chart for overall contract score                                                                                   |
| [Framer Motion](https://www.framer.com/motion/)                                          | Upload modal and results animations                                                                                    |
| [react-dropzone](https://react-dropzone.js.org/)                                         | PDF drag-and-drop                                                                                                      |
| [Sonner](https://sonner.emilkowal.ski/)                                                  | Toast notifications                                                                                                    |
| [Lucide React](https://lucide.dev)                                                       | Icon set                                                                                                               |
| [Helmet](https://helmetjs.github.io/)                                                    | HTTP security headers                                                                                                  |
| [Geist](https://vercel.com/font) / [Geist Mono](https://vercel.com/font)                 | Variable fonts loaded locally                                                                                          |

## Project Structure

```
contract-analysis/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (private)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── contract/
│   │   │   │   │       └── [id]/
│   │   │   │   │           └── _components/
│   │   │   │   ├── pricing/
│   │   │   │   ├── payment_success/
│   │   │   │   └── payment_cancel/
│   │   │   └── fonts/
│   │   ├── components/
│   │   │   ├── analysis/
│   │   │   ├── dashboard/
│   │   │   ├── modals/
│   │   │   ├── shared/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── interfaces/
│   │   ├── lib/
│   │   ├── providers/
│   │   │   ├── modals/
│   │   │   └── tanstack/
│   │   └── store/
│   ├── components.json
│   ├── next.config.ts
│   └── package.json
└── server/
    ├── src/
    │   ├── config/
    │   ├── controller/
    │   ├── middlewares/
    │   ├── model/
    │   ├── routes/
    │   ├── services/
    │   └── utils/
    ├── docker-compose.yaml
    ├── .env.example
    └── package.json
```

**[`client/src/app/(private)/`](<client/src/app/(private)/>)** — Authenticated routes: dashboard, contract detail, pricing, and payment result pages.

**[`client/src/components/analysis/`](client/src/components/analysis/)** — Analysis results UI: charts, empty states, and the main results component.

**[`client/src/components/ui/`](client/src/components/ui/)** — shadcn/ui primitives built on Radix.

**[`client/src/app/fonts/`](client/src/app/fonts/)** — Local Geist variable font files referenced by [`layout.tsx`](client/src/app/layout.tsx).

**[`server/src/services/`](server/src/services/)** — AI analysis, PDF extraction, and email delivery.

**[`server/src/controller/`](server/src/controller/)** — Request handlers for contracts, Stripe payments, and VNPay checkout.

**[`server/docker-compose.yaml`](server/docker-compose.yaml)** — Local MongoDB for development.
