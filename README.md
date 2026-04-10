# vrxp
Virtual Reality Campus


#Docker Commands
```
docker build -t vrxp_img .
```
```
docker image ls
```
```
docker container ls
```
```
#For Windows:

docker run -it --rm -p 8080:80 -v"$PWD\public":/usr/share/nginx/html --name vrxp_con vrxp_img

#For Mac:
docker run -it --rm -p 8080:80 -v ${PWD}/public:/usr/share/nginx/html --name vrxp_con vrxp_img
```
```
docker exec -it vrxp_con /bin/sh
``

NAMING CONVENTION:
- Use camelCase for folders
- Use snake_case for files
- Note that there are currently exceptions from early development, but use this naming convention going forward