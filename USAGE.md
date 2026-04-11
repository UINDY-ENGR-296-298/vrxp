# Usage

## Prerequisites

- Install Docker Desktop for your operating system:
  - Windows: https://www.docker.com/products/docker-desktop
  - macOS: https://www.docker.com/products/docker-desktop
  - Linux: use your distribution's Docker package or https://docs.docker.com/engine/install/

- Start Docker Desktop before running the project.
  - Windows: open Docker Desktop and click `Start` if it is not already running.

## Local development

From the repository root, build the Docker image:

- Windows / macOS / Linux:

```powershell
docker build -t vrxp_img .
```

Start the container with the local `public/` folder mounted into nginx:

- Windows PowerShell:

```powershell
docker run -it --rm -p 8080:80 -v "$PWD\public":/usr/share/nginx/html --name vrxp_con vrxp_img
```

- macOS / Linux:

```bash
docker run -it --rm -p 8080:80 -v ${PWD}/public:/usr/share/nginx/html --name vrxp_con vrxp_img
```

Open the app in a browser at:

```text
http://localhost:8080
```

To inspect the running container or debug files inside it:

```bash
docker exec -it vrxp_con /bin/sh
```

## Deploying the project

For deploying the project, open the command prompt and run the folling
```
ssh username@34.41.149.72
```
where username = your user name in the project system. 

Then zip the latest stable version of the project, and, in a different command prompt, run as follows:
```
scp path/to/zipped/project/file username@34.41.149.72:~/.
```

Then go back to the original command prompt and run as follows in order:
```
sudo mv zipped_file ../../var/www

cd ../../var/www

sudo rm -rf old_file

unzip zipped_file

cd unzipped_file

docker stop vrxp_container # or whatever the old docker container name was last used

docker buildx build -t vrxp_image .

docker run -it --rm -p 8080:80 -v ${PWD}/public:/usr/share/nginx/html --name vrxp_container vrxp_image

```

From there, you should be able to close both command prompts, and good job!
The deployed project has been updated!


