#!/bin/bash

# Automated deployment to the server.

# This will pull main and deploy it to the website. You NEED to have an ssh key put in ~/.ssh
# You also need to put the public key of that as a key in your github account.

# This pulls as if its your account, does `npm build` and restarts apache

if [ $# -eq 0 ]; then
        echo "usage deploy.sh <your user name>"
        exit 1
fi


sudo git checkout main
sudo GIT_SSH_COMMAND="ssh -i /home/$1/.ssh/id_rsa" git pull

# only run if that pull worked
if [ $? == 0 ]; then
        sudo npm run build
#        sudo service apache2 restart
fi
