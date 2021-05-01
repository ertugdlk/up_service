#!/bin/bash

#give permission for everything in the up_service-app directory
sudo chmod -R 777 /home/ec2-user/

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#navigate into our working directory where we have all our bitbucket files
cd /home/ec2-user/up_service
pm2 stop 0
