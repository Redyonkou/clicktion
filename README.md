# Clicktion - WT Projekt (Klicker)

## Description

Lets users create and evalute surveys.  
Users can also parttake in surveys and vote for multiple choice questions

---
## How to start the project

0. stop possible existing mysql severs  
[optional: only if mysql-server is installed and running]  
```bash
$ sudo /etc/init.d/mysql stop
```


1. start the app  
IMPORTANT: Cloned repository MUST be in home directory  
OR services.app.volumes and services.mysql.volumes  
in "[your_directory]/clicktion/exapp/docker-compose.yml"   
must be adjusted to fit "[your_directory]/clicktion/..."
```bash
$ cd ~/clicktion/exapp
$ docker-compose up
```
---  

## How to test the project

1. connect to the server running on localhost:3000  

1a) Use a Browser and enter "http://localhost:3000"  

1b) Use curl to test e.g. Database-features
