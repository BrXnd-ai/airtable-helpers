# Airtable Helpers

Airtable Helpers is a NextJS app that can easily be run on Vercel or elsewhere and provides some helpful utilities to call from Airtable automations.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## (Optional) Setup Cloudflare Tunnel

For local development, you can set up a Cloudflare tunnel that you can call from
airtable. I like
[the instructions here](https://kirillplatonov.com/posts/setting-up-cloudflare-tunnel-for-development/).

You'll need to be a Cloudflare user with a domain pointing there (it's free to
use their DNS servies).

### Setup the CLI

```bash
brew install cloudflare/cloudflare/cloudflared
```

Then:

```
cloudflared tunnel login
```

### Create the Tunnel

```bash
cloudflared tunnel create <Tunnel-NAME>
```

After that, point the subdomain to the tunnel:

```bash
cloudflared tunnel route dns <Tunnel-NAME> <SUBDOMAIN>
```

### Setup the Tunnel in the App

First, **create a new folder at the root of the app called `.cloudflared`**.

Second, on your computer, find `~/.cloudflared/<Tunnel-UUID>.json` and copy that
file to the `.cloudflared` folder we just created. **After it's copied, make
sure you rename it `credentials.json`.**

Third, create a file in that folder called `config.yml` with the following info:

```yml
tunnel: <Tunnel-UUID>
credentials-file: .cloudflared/credentials.json
noTLSVerify: true
```

Finally, give `bin/tunnel` execute permissions:

```bash
chmod +x bin/tunnel
```

### Run Your Tunnel

Assuming your app is already running (if it's not, `npm run dev`), then all you
need to do is run:

```bash
bin/tunnel <port>
```

For example, if it's running on 3000 (default) you would run `bin/tunnel 3000`
in a new terminal window and everything should be good to go. Test it out by
going to the domain you entered and you should see the homepage for the app (it
just says "airtable helpers" if you haven't changed anything).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.
