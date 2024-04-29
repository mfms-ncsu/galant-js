# Galant Web

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
- run `npm run build` after each change.
- Run `npm start` to run app to develop.

### Testing
- To run all tests, in the base directory run `$ npm run test`.
  - This script does the following:
      1. Executes `npm run test:jest`
      2. Executes `npm run test:cy`
      3. Combines coverage from `/coverage` and `/cypress-coverage`
      4. Create a new coverage report under directory `/total-coverage`

- Total Coverage:
  - Results are found under /total-coverage directory.

### Deployment
To deploy a change to the production server:
- BOX currently refers to `galant.csc.ncsu.edu`, but can be replaced with any server, and UID to the login id on the box, unity id currently
- log on to BOX using UID
- Create an ssh key if you haven't already with `ssh-keygen` and make sure it is in `~/.ssh` in a file called id_rsa (public key is in id_rsa.pub)
- Copy the public key you created to your Github settings (Settings > SSH keys).
- Go to the base of the project at `/var/www/galant-js` and run `$ ./deploy.sh UID
    - This script pulls `main`, runs `npm run build` and restarts Apache. You can also do this all manually if you want.

***Note:*** *It appears that you have to own the files in `/var/www/galant-js` to do the ` git pull` command in the script successfully.* There may be a workaround.

This software is licensed by a [Gnu Public License](https://www.gnu.org/licenses/gpl.html).
