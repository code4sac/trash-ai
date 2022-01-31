## Github Actions

The main entrypoint for github actions is [github_actions.py](../bin/github_actions.py)

---

### Continuous deployment

The above script `github_actions.py` has a class config at
`Config.ACTION_CHANGE_DIRS` that will glob files and match actions based on
what files have changed

---

### Manual Actions

If for whatever reason you need to manually kick off a deployment, you can do
so here.

Manual actions can be run by going to [The Manual Actions Page](https://github.com/shollingsworth/trash-ai/actions/workflows/manual_run.yaml)
and selecting `Run workflow`

---
