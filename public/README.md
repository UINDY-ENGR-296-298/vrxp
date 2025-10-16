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
docker run -it --rm -p 8080:8080 --name vrxp_con  -v /home/arkroot/Documents/temp/vrxp/public:/app/public vrxp_img
```
```
docker exec -it vrxp_con /bin/sh
``