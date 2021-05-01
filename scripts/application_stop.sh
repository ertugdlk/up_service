#!/bin/bash

#give permission for everything in the up_service-app directory
sudo chmod -R 777 /home/ec2-user/up_service

#navigate into our working directory where we have all our bitbucket files
cd /home/ec2-user/up_service
pm2 stop 0
