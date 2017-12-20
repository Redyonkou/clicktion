# How to start the server
1. stop possible existing mysql severs 
(sudo /etc/init.d/mysql stop)

2. start the mysql docker image (directory-structure = */home/your-user-name/clicktion*)
docker run --rm -d --name clicktion-mysql -p 3306:3306 -v ~/clicktion/database/lib:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=clicktiondb -e MYSQL_USER=user -e MYSQL_PASSWORD=dbpassword mysql

3. go into exapp-directory

4. update dependencies
(npm install)

5. start the express-server 
npm start
