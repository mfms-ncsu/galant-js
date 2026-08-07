# Preparation

To create json files of for the lists of graph and algorithm examples, do the following.
* make sure all the graphs are listed in in the desired order in 0-file_list.txt in subdirectories (of `public/collection`)algorithms, graphs, trees and layered-graphs; one way to do this is `ls > 0-file-list.txt` and then move the files around into the desired order
* do the following in all three subdirectories
```
~/Git/galant-js/conversion-scripts/dir2index.py -f json `cat 0-file-list.txt` > tmp.json
```
**Note:** `dir2index.py` is quite useful in other ways - you may want to put it in your bin directory or add it to your path.
* move `algorithms/tmp.json` to `../../src/data/algorithms.json`
* Use a text editor to combine the json files in `graphs`, `trees` and `layered-graphs` into a single list and move the result as `src/data/graphs.json`
Easiest way to do the combining is to cat the files together into, e.g., `tmp-combined.json` and replace the two occurrences of `][` (on separate lines) with a comma
* delete the `tmp.json` files in `graphs`, `trees` and `layered-graphs`, and the combined version, if any

If only a single or small number of files need to change, you can do, for example,
```
conversion-scripts/dir2index.py -f json file_1 file_2 > tmp.json
```
and then edit the appropriate json file in `src/data/` to replace the entries for `file_1` and `file_2`

* Check to make sure the examples are updated. Do an `npm run build` and clear browser data first.

# Production deployment

Before deployment, do thorough testing in the branch where changes were made (typically `dev`),
then merge `dev` into `main` using the `--no-ff` and `--no-commit` options, fixing the conflicts before committing.
Do a sanity check to make sure nothing was broken during the merge
* `git diff dev` should not show any major changes
* test, for example, dfs-scc on g-12
* briefly test any newly added features

After committing in `main` do
```
git push https://mfms-ncsu@github.com/mfms-ncsu/galant-js main
```
Technically, you should do a pull request - if you're familiar.

To deploy a change to the production server:
- BOX currently refers to `galant.csc.ncsu.edu`, but can be replaced with any server, and UID to the login id on the box, unity id currently
- log on to BOX using UID
- Create an ssh key if you haven't already with `ssh-keygen` and make sure it is in `~/.ssh` in a file called id_rsa (public key is in id_rsa.pub)
- Copy the public key you created to your Github settings (Settings > SSH keys).
- Go to the base of the project at `/var/www/galant-js` and run `$ ./deploy.sh UID
    - This script pulls `main`, runs `npm run build` and restarts Apache. You can also do this all manually if you want.

