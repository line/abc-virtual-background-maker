# ABC Virtual Background Maker Contributing Guide

Hi! We're really excited that you're interested in contributing to ABC Virtual Background Maker! Before submitting your contribution, please read through the following guide.

## 💻 Local Development

We recommend using Node.js Version 18+ and [pnpm](https://pnpm.io/installation)

1. In the repo folder, install packages first.

   ```bash
   pnpm install
   ```

2. Run dev server.

   ```bash
   pnpm run dev
   ```

3. Dev server will be running at

   ```bash
   http://localhost:5173/
   ```

## 🌵 Pull Request Guidelines

- Checkout a topic branch from a base branch `main`, and merge back against that branch.
- Make sure the husky pre-commit hook has passed!
- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first, and have it approved before working on it.

- If fixing a bug:

  - If you are resolving a special issue, add `fix #issueId` in your PR title.
  - Provide a detailed description of the bug and how you fix it in the PR.

## 🧑🏻‍🔧 Maintenance Guidelines

> The following section is mostly for maintainers who have commit access, but it's helpful to go through if you intend to make non-trivial contributions to the codebase.

### Think Before Adding a Dependency

- Most deps should be added to `devDependencies`.
- Avoid deps with large transitive dependencies that result in bloated size compared to the functionality it provides.

### Ensure Type Support

ABC Virtual Background Maker aims to be fully usable as a dependency in a TypeScript project.

## 🕸️ Deploy Demo Website

Once the PR merged into base branch `main`, it will be automatically deployed to github pages.
