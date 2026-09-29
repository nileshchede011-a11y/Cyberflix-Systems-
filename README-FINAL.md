# Cyberflix Systems LLP — Final Website

## Frontend
Static HTML/CSS/JavaScript pages with responsive Cyberflix cyan theme.

Pages: Home, Components, PC Builder, Cart, Checkout, Order Confirmation, Login, Wishlist, Orders.

## Backend
Vercel serverless API + Supabase schema is included in `api/` and `supabase/`.

Set these Vercel environment variables:
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`

Never expose the secret key in frontend code.

## Local
Open the folder in VS Code. For the static frontend you can use Live Server; for API routes use Vercel dev or deploy to Vercel.

## Git
```powershell
git add -A
git commit -m "Final Cyberflix website with components alignment fix"
git push origin main
```
