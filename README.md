# Galant Web

***[+++ Check the development branch for the latest updates and feature requests +++]***

<div align='center'>
  <a href='https://galant.csc.ncsu.edu'>
  <img src='https://github.com/mfms-ncsu/galant-js/blob/main/public/img/galant_full_logo.svg?raw=true' alt='Galant Logo' width=600px/>
  </a>
</div>

A web implementation of [Galant](https://github.com/mfms-ncsu/galant), a **g**raph **al**gorithm **an**imation **t**ool.

See the site at https://galant.csc.ncsu.edu.

Developer and User documentation can be found [here](https://galant.csc.ncsu.edu/documentation).

### Development
- Clone repo, run `npm install` in repo directory.
- Run `npm start` to run app to develop.

### Testing
- To run all tests, in the base directory run `$ npm test -- --coverage --watchAll`.

### Deployment
To deploy a change to the production server:
- Create an ssh key if you haven't already with `ssh-keygen` and make sure it is in `~/.ssh`.
- Copy the public key you created to your Github settings (Settings > SSH keys).
- Go to the base of the project at `/var/www/web-based-galant` and run `$ ./deploy.sh <your username on the box>`
    - This script pulls `main`, runs `npm run build` and restarts Apache. You can also do this all manually if you want.

This software is licensed by a [Gnu Public License](https://www.gnu.org/licenses/gpl.html).
