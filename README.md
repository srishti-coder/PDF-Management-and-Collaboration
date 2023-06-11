# PDF-Management-and-Collaboration

Website: [Link](http://ec2-18-142-54-33.ap-southeast-1.compute.amazonaws.com)

### Local Setup

- Install [git](https://github.com/git-guides/install-git), [docker](https://docs.docker.com/get-docker/) & [docker-compose](https://docs.docker.com/compose/install/).
- Run `docker-compose build` to build the docker image.
- Run `docker-compose up` to start the server.
- Open `localhost:8000` in your browser to view the app.

### WebApp Tech Stack

- Backend [django](https://www.djangoproject.com/) code is in `apps` folder.
- Django settings are in `config` folder.
- Frontend [react](https://react.dev/) Code is in `fe-apps` folder.
- React code is accessed by Django through `templates` folder.
- For styling, I are using [tailwindcss](https://tailwindcss.com/) & [daisyui](https://daisyui.com/).
- For state management, I are using [zustand](https://github.com/pmndrs/zustand)

### Workflow Description

#### Authentication App

- User can register using email & password.
- User can login using email & password.
- User can logout.
- User can reset password using email.

#### Dashboard App

Authentication is required to access this app.

- User can upload pdf files.
- User can view uploaded pdf files.
- User can search pdf files.

#### PDF Viewer App

Authentication is required to access this app.

- User can view pdf files.
- User can share pdf files with other users using email ( email may or may not be registered in the app ).
- User can view the shared users & can revoke the access if required.
- User can delete the pdf file.
- User can comment on the pdf file.
- User can reply to the comment.

#### Shared PDF Viewer App

- User can view pdf files.
- User can comment on the pdf file.
- User can reply to the comment.

### Security Features

- User passwords are hashed.
- I am using token based authentication. And token gets saved in cookies which expires in a month on remember me.
- Link for reseting password expires in 1 hours
- Dashboard & PdfViewer app are protected using authentication including all functionality in them.
- Access to SharedPdfViewer app for any pdf is controlled by the owner of the pdf.
- Pdf url is not exposed to the user in the website to prevent unauthorized access.
- Pdf cannot be downloaded in PdfViewer or SharedPdfViewer app.

### Additional Features

- Auto redirecting to authenticaion page on unauthorized access & redirect back to that page on signin.
