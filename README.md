# LibGSN

The web interface for the LibGSN web repository. Runs on an S3 backend and a PostgreSQL database.

## Environment variables

- `S3_HOST` is the host URL, for example `https://abc.digitaloceanspaces.com/`.
- `S3_CDN_HOST` is the CDN host URL, for example `https://<bucket-name>.<provider>/`.
- `S3_ACCESS_KEY_ID` is the access key ID.
- `S3_SECRET` is the secret key to use the S3 service.
- `S3_REGION` is the bucket region.
- `S3_BUCKET_NAME` is self-explanatory.
- `DATABASE_URL` is the URL for the PostgreSQL database. Further information is provided later.
- `CSRF_SECRET` is the secret that CSRF cookies will be signed with.
- `COOKIE_SIGN` is the secret that session ID cookies will be signed with.

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
bun run build
```

## Deployment

### Docker Deployment

This template includes three Dockerfiles optimized for different package managers:

- `Dockerfile` - for npm
- `Dockerfile.pnpm` - for pnpm
- `Dockerfile.bun` - for bun

To build and run using Docker:

```bash
# For npm
docker build -t my-app .

# For pnpm
docker build -f Dockerfile.pnpm -t my-app .

# For bun
docker build -f Dockerfile.bun -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Database setup
I'll make a separate folder for the needed SQL scripts soon.

## S3 setup
Your S3 should contain `index/index.json` which follows the following schema:
```ts
interface LibGSNIndex {
  categories: {
    name: string,
    key: string,
    subjects: {
      name: string,
      code: string[]
    }[]
  }[],
  doctype: {
    name: string,
    code: number
  }[],
}
```

There should also be an empty `files/` directory, which is where the files are stored.

---

Built with ❤️ using React Router.