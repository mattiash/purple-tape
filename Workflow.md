# Workflow

Code built and tested automatically with Github Actions.
To publish a new release, do the following:

1. Update package.json with a new version number
2. Update CHANGELOG.md
3. Run `npm install` to update package-lock.json with new version number
4. commit
5. Run `./check-publish
6. push master
7. Tag with `v1.2.3`
8. Push the tag
