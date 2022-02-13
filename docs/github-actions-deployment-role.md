## Github Deployment Role

### Updating Role Permissions

---

All the statements the role has access to can be found in [deployrole.ts](../infra/lib/bootstrap/deployrole.ts) inside the `get_statements` function.

You can input your admin creds and update the permission on the [Github Role Actions](https://github.com/shollingsworth/trash-ai/actions/workflows/github-role.yaml) page after editing them in a branch and pushing to github.

If you want to do this locally you can run `make github_role_update` from the
root of the project repo. (_ make sure an admin profile is set for the aws account_)
