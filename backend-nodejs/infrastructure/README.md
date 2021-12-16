[Back to Main README](../README.md)
## Deploying Infrastructure
The cloud resources can be provisioned automatically using Terraform 

### You will need: 
* [Terraform (v0.13.0)](https://www.terraform.io/downloads.html)

Terraform (v0.13.0) can be installed and managed using [Terraform Version Manager](https://github.com/tfutils/tfenv)

```
echo 'export PATH="$HOME/.tfenv/bin:$PATH"' >> ~/.bash_profile
```

```
tfenv install 0.13.0
tfenv use 0.13.0
```

### Heroku Deployment:

You'll need a set of credentials to your Heroku account stored in a file *secret.tfvars* that looks like this

```
heroku_account_email = "<account email>"
heroku_api_key = "<heroku api key>"
```

Once that file is setup in the *infrastructure/heroku* directory, you're ready to deploy the application: 

```
cd infrastructure/heroku
terraform init -var-file="secret.tfvars"
terraform plan -var-file="secret.tfvars"
terraform apply -var-file="secret.tfvars"
```
