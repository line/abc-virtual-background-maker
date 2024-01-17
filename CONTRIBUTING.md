# ABC Virtual Background Maker Contributing Guide

Hi! We're really excited that you're interested in contributing to ABC Virtual Background Maker! Before submitting your contribution, please read through the following guide.

## Repo Setup

To develop locally, fork the repository and clone it in your local machine. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test:

1. Run `pnpm i` in root folder.

2. (Optional. Run `pnpm run read-files` if you want to update app.config.json with new images)

3. Run `pnpm run dev` in root folder.

4. Dev server will be running at

   ```bash
   http://localhost:5173/
   ```

## Pull Request Guidelines

- Checkout a topic branch from a base branch (e.g. `main`), and merge back against that branch.
- Make sure husky pre-commit hook pass!
- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first, and have it approved before working on it.

- If fixing a bug:

  - If you are resolving a special issue, add `fix #issueId` in your PR title.
  - Provide a detailed description of the bug and how you fix it in the PR.

## Maintenance Guidelines

> The following section is mostly for maintainers who have commit access, but it's helpful to go through if you intend to make non-trivial contributions to the codebase.

### Think Before Adding a Dependency

- Most deps should be added to `devDependencies`.
- Avoid deps with large transitive dependencies that result in bloated size compared to the functionality it provides.

### Ensure Type Support

ABC Virtual Background Maker aims to be fully usable as a dependency in a TypeScript project.

## Deploy Demo

Once the PR merged into base branch (e.g. `main`), it will be deployed by automatically.
